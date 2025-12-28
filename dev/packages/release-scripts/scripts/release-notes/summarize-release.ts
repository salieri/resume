import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

export interface ReleaseSummaryOptions {
  currentTag: string;
  previousTag?: string;
}

export interface ReleaseSummary {
  currentTag: string;
  previousTag?: string;
  range: string;
  commits: { hash: string; subject: string }[];
  tagNotes: { current?: string; previous?: string };
  pullRequestNumbers: number[];
}

const execGit = async (args: string[]) => {
  const { stdout } = await promisify(execFile)('git', args, { encoding: 'utf8' });

  return stdout.trim();
};

const assertTagExists = async (tag: string) => {
  await execGit(['rev-parse', '--verify', tag]);
};

const findPreviousTag = async (currentTag: string) => {
  const tagsRaw = await execGit(['tag', '--sort=-creatordate']);
  const tags = tagsRaw.split('\n').filter(Boolean);
  const currentIndex = tags.indexOf(currentTag);

  if (currentIndex === -1) {
    throw new Error(`Tag "${currentTag}" not found when searching for previous tag.`);
  }

  return tags[currentIndex + 1];
};

const getTagAnnotation = async (tag?: string) => {
  if (!tag) {
    return;
  }

  const raw = await execGit(['for-each-ref', `refs/tags/${tag}`, '--format=%(contents)']);
  const cleaned = raw.trim();

  return cleaned.length > 0 ? cleaned : undefined;
};

const getCommitsBetween = async (range: string) => {
  const output = await execGit(['log', '--no-merges', '--pretty=format:%h%x09%s', range]);

  return output.length === 0
    ? []
    : output.split('\n').map((line) => {
        const [hash, ...subjectParts] = line.split('\t');

        return { hash, subject: subjectParts.join('\t').trim() };
      });
};

const getPullRequestNumbersBetween = async (range: string) => {
  const logOutput = await execGit(['log', '--pretty=format:%B%x1e', range]);
  const entries = logOutput.split('\u001E').filter(Boolean);
  const prNumbers = new Set<number>();

  for (const entry of entries) {
    const matches = entry.matchAll(/#(\d+)/g);

    for (const match of matches) {
      const parsed = Number.parseInt(match[1], 10);

      if (!Number.isNaN(parsed)) {
        prNumbers.add(parsed);
      }
    }
  }

  return [...prNumbers].toSorted((a, b) => a - b);
};

export const summarizeRelease = async (options: ReleaseSummaryOptions): Promise<ReleaseSummary> => {
  await assertTagExists(options.currentTag);

  const previousTag = options.previousTag || (await findPreviousTag(options.currentTag));
  const range = previousTag ? `${previousTag}..${options.currentTag}` : options.currentTag;

  if (previousTag) {
    await assertTagExists(previousTag);
  }

  const commits = await getCommitsBetween(range);

  const tagNotes = {
    current: await getTagAnnotation(options.currentTag),
    previous: await getTagAnnotation(previousTag),
  };

  const pullRequestNumbers = await getPullRequestNumbersBetween(range);

  return {
    currentTag: options.currentTag,
    previousTag,
    range,
    commits,
    tagNotes,
    pullRequestNumbers,
  };
};
