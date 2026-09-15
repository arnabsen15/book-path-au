import type { Movie } from '../types'
import type { RegionConfig } from '../region'

export function encodeQuery(text: string): string {
  return encodeURIComponent(text)
}

function titleQuery(movie: Movie): string {
  return movie.year ? `${movie.title} ${movie.year}` : movie.title
}

export function justWatchSearchUrl(movie: Movie, region: RegionConfig): string {
  return `https://www.justwatch.com/${region.justWatch}/search?q=${encodeQuery(movie.title)}`
}

export function internetArchiveMoviesSearchUrl(movie: Movie): string {
  return `https://archive.org/search?query=${encodeQuery(`${movie.title} AND mediatype:movies`)}`
}

export function kanopySearchUrl(movie: Movie): string {
  return `https://www.kanopy.com/en/search?query=${encodeQuery(movie.title)}`
}

export function beamafilmSearchUrl(movie: Movie): string {
  return `https://www.beamafilm.com/search?q=${encodeQuery(movie.title)}`
}

/** Free-to-air / free catch-up search links (AU) — do not claim availability. */
export function sbsOnDemandSearchUrl(movie: Movie): string {
  // Path form keeps the query; ?q= is dropped by SBS.
  return `https://www.sbs.com.au/ondemand/search/${encodeQuery(movie.title)}`
}

export function abcIviewSearchUrl(movie: Movie): string {
  return `https://iview.abc.net.au/search?q=${encodeQuery(movie.title)}`
}

/** 7plus has no reliable deep-link search (?q= ignored). Google site: is honest. */
export function sevenPlusSearchUrl(movie: Movie): string {
  return `https://www.google.com/search?q=${encodeQuery(`site:7plus.com.au ${movie.title}`)}`
}

export function nineNowSearchUrl(movie: Movie): string {
  return `https://www.9now.com.au/search?q=${encodeQuery(movie.title)}`
}

/**
 * 10play.com.au/search?q= redirects to 10.com.au (wrong product).
 * Stay on 10 Play via Google site: search.
 */
export function tenPlaySearchUrl(movie: Movie): string {
  return `https://www.google.com/search?q=${encodeQuery(`site:10play.com.au ${movie.title}`)}`
}

/** AU-friendly Prime search; bots often see 503 — humans usually OK. */
export function primeVideoSearchUrl(movie: Movie): string {
  return `https://www.primevideo.com/region/au/search?phrase=${encodeQuery(titleQuery(movie))}`
}

export function appleTvSearchUrl(movie: Movie, region: RegionConfig): string {
  return `https://tv.apple.com/${region.appleTvLocale}/search?term=${encodeQuery(titleQuery(movie))}`
}

export function googlePlayMoviesSearchUrl(movie: Movie): string {
  return `https://play.google.com/store/search?q=${encodeQuery(titleQuery(movie))}&c=movies`
}

export function youtubeMoviesSearchUrl(movie: Movie): string {
  return `https://www.youtube.com/results?search_query=${encodeQuery(`${titleQuery(movie)} movie`)}`
}

export function netflixSearchUrl(movie: Movie): string {
  return `https://www.netflix.com/search?q=${encodeQuery(movie.title)}`
}

export function amazonMovieSearchUrl(movie: Movie, region: RegionConfig): string {
  return `https://${region.amazonHost}/s?k=${encodeQuery(`${titleQuery(movie)} movie`)}`
}

export function cinemaShowtimesSearchUrl(
  movie: Movie,
  region: RegionConfig,
  suburb?: string | null,
): string {
  const place = (suburb && suburb.trim()) || region.cinemaCity
  const near = suburb && suburb.trim() ? `near ${suburb.trim()}` : `near me`
  return `https://www.google.com/search?q=${encodeQuery(`${movie.title} showtimes ${near} ${place}`)}`
}

export function villageCinemasSearchUrl(movie: Movie): string {
  return `https://www.google.com/search?q=${encodeQuery(`site:villagecinemas.com.au ${movie.title} showtimes`)}`
}

export function hoytsSearchUrl(movie: Movie): string {
  return `https://www.google.com/search?q=${encodeQuery(`site:hoyts.com.au ${movie.title} showtimes`)}`
}

export function eventCinemasSearchUrl(movie: Movie): string {
  return `https://www.google.com/search?q=${encodeQuery(`site:eventcinemas.com.au ${movie.title} showtimes`)}`
}

export function disneyPlusSearchUrl(movie: Movie): string {
  return `https://www.disneyplus.com/search/${encodeQuery(movie.title)}`
}

export function stanSearchUrl(movie: Movie): string {
  return `https://www.stan.com.au/search?q=${encodeQuery(movie.title)}`
}

export function bingeSearchUrl(movie: Movie): string {
  return `https://binge.com.au/search?q=${encodeQuery(movie.title)}`
}

export function appleTvPlusSearchUrl(movie: Movie, region: RegionConfig): string {
  return `https://tv.apple.com/${region.appleTvLocale}/search?term=${encodeQuery(titleQuery(movie))}`
}
