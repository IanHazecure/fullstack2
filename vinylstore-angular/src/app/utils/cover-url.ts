export function resolveCoverUrl(cover: string | undefined | null): string {
  if (!cover) return '';

  const trimmed = cover.trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')) {
    return trimmed;
  }

  if (trimmed.startsWith('rg:')) {
    return `https://coverartarchive.org/release-group/${trimmed.slice(3)}/front`;
  }

  return `https://coverartarchive.org/release/${trimmed}/front`;
}
//
//https://musicbrainz.org/search?query=the+cure&type=artist&method=indexed
//api the musicbrainz y github