import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'
import en from 'dictionary-en'
import nspell from 'nspell'
const spell = nspell(en)

// Create a promise-based wrapper for dictionary-en
function lookupWord(word: string): boolean {
	return spell.correct(word)
}

export class FirehoseSubscription extends FirehoseSubscriptionBase {
  async handleEvent(evt: RepoEvent) {
    if (!isCommit(evt)) return

    const ops = await getOpsByType(evt)

    const postsToDelete = ops.posts.deletes.map((del) => del.uri)
    const postsToCreate: Array<{ uri: string, cid: string, indexedAt: string }> = [];

    // Process the posts that should be created
    for (const create of ops.posts.creates) {
      try {
        const text = create.record.text
        if (text && text.trim().length > 0) {
          const isAcrosticPost = await isAcrostic(text)
          if (isAcrosticPost) {
            postsToCreate.push({
              uri: create.uri,
              cid: create.cid,
              indexedAt: new Date().toISOString(),
            })
          }
        }
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error('Error processing post:', err)
      }
    }

    if (postsToDelete.length > 0) {
      await this.db
        .deleteFrom('post')
        .where('uri', 'in', postsToDelete)
        .execute()
    }
    if (postsToCreate.length > 0) {
      await this.db
        .insertInto('post')
        .values(postsToCreate)
        .onConflict((oc) => oc.doNothing())
        .execute()
    }
  }
}

function isAcrostic(text: string): boolean {
  // Split by newlines and get first character of each line
  const lines = text.split('\n')
    .filter(line => line.trim().length > 0) // Remove empty lines
    .map(line => line.trim().charAt(0))

  // Needs at least 4 lines to be considered an acrostic
  if (lines.length < 4) {
    return false
  }

  const word = lines.join('')
  return lookupWord(word)
}
