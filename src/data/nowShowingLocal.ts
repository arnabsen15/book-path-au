/**
 * Curated “now showing” near Manor Lakes / Werribee.
 * Static / indicative only — always book on the cinema site.
 * Verified public pages Sep 2026 (Village movie page + HOYTS listing).
 */

export interface IndicativeSessions {
  /** e.g. Sat 19 Sep 2026 */
  dateLabel: string
  cinemaLabel: string
  times: string[]
  disclaimer: string
}

export interface CinemaDeepLinks {
  villageMovieUrl?: string
  villageCinemaUrl?: string
  /** Best Village deep link for booking / sessions */
  villagePrimaryUrl: string
  hoytsMovieUrl?: string
  hoytsWatergardensUrl?: string
  hoytsHighpointUrl?: string
  /** Best HOYTS deep link */
  hoytsPrimaryUrl: string
}

export interface NowShowingSeed {
  id: string
  title: string
  year: number
  emphasis?: boolean
  note?: string
  coverUrl?: string
  director?: string
  cinema: CinemaDeepLinks
  indicativeSessions?: IndicativeSessions
}

export const DEFAULT_SUBURB = 'Manor Lakes'
export const SUBURB_HINT = 'Manor Lakes / Werribee'

/** Village Werribee cinema home — public sessions page */
export const VILLAGE_WERRIBEE_URL = 'https://villagecinemas.com.au/cinemas/werribee'

export const HOYTS_WATERGARDENS_URL = 'https://www.hoyts.com.au/cinemas/watergardens'
export const HOYTS_HIGHPOINT_URL = 'https://www.hoyts.com.au/cinemas/highpoint'

export const NOW_SHOWING_LOCAL: NowShowingSeed[] = [
  {
    id: 'hanuman-ansh-2026',
    title: 'Hanuman Ansh',
    year: 2026,
    emphasis: true,
    director: 'Vishal Chaturvedi',
    note: 'In cinemas from Thu 17 Sep 2026 (Village + HOYTS public listings).',
    coverUrl:
      'https://images.ctfassets.net/0scfp84lysj4/5woX0lc0dUEfvtY6I8pKHY/5e3f874257b9c2c6c470fd4922d68b9d/2d0aqa_HANUMAN-TP_500px.jpg',
    cinema: {
      villageMovieUrl: 'https://villagecinemas.com.au/movies/hanuman-ansh',
      villageCinemaUrl: VILLAGE_WERRIBEE_URL,
      villagePrimaryUrl: 'https://villagecinemas.com.au/movies/hanuman-ansh',
      hoytsMovieUrl: 'https://www.hoyts.com.au/movies/hanuman-ansh-hindi-eng-sub',
      hoytsWatergardensUrl: HOYTS_WATERGARDENS_URL,
      hoytsHighpointUrl: HOYTS_HIGHPOINT_URL,
      hoytsPrimaryUrl: 'https://www.hoyts.com.au/movies/hanuman-ansh-hindi-eng-sub',
    },
    indicativeSessions: {
      dateLabel: 'Sat 19 Sep 2026',
      cinemaLabel: 'Village Werribee',
      times: ['10:40', '2:00', '5:20', '8:15', '8:45'],
      disclaimer: 'Indicative — check cinema before you go.',
    },
  },
  {
    id: 'fall-2-2026',
    title: 'Fall 2',
    year: 2026,
    note: 'Listed on Village Werribee schedules (public aggregator / cinema pages).',
    cinema: {
      villageCinemaUrl: VILLAGE_WERRIBEE_URL,
      villagePrimaryUrl: VILLAGE_WERRIBEE_URL,
      hoytsPrimaryUrl: 'https://www.hoyts.com.au/movies',
    },
  },
  {
    id: 'insidious-out-of-the-further-2026',
    title: 'Insidious: Out of the Further',
    year: 2026,
    note: 'Listed on Village Werribee schedules.',
    cinema: {
      villageCinemaUrl: VILLAGE_WERRIBEE_URL,
      villagePrimaryUrl: VILLAGE_WERRIBEE_URL,
      hoytsPrimaryUrl: 'https://www.hoyts.com.au/movies',
    },
  },
  {
    id: 'spider-man-brand-new-day-2026',
    title: 'Spider-Man: Brand New Day',
    year: 2026,
    note: 'Listed on Village Werribee schedules.',
    cinema: {
      villageCinemaUrl: VILLAGE_WERRIBEE_URL,
      villagePrimaryUrl: VILLAGE_WERRIBEE_URL,
      hoytsPrimaryUrl: 'https://www.hoyts.com.au/movies',
    },
  },
  {
    id: 'toy-story-5-2026',
    title: 'Toy Story 5',
    year: 2026,
    note: 'Coming / listed on HOYTS & Village public movie boards.',
    cinema: {
      villageCinemaUrl: VILLAGE_WERRIBEE_URL,
      villagePrimaryUrl: VILLAGE_WERRIBEE_URL,
      hoytsPrimaryUrl: 'https://www.hoyts.com.au/movies',
    },
  },
]

export function getNowShowingById(id: string): NowShowingSeed | undefined {
  return NOW_SHOWING_LOCAL.find((m) => m.id === id)
}

export function isTheatricalTitle(movieId: string, tags?: string[]): boolean {
  if (getNowShowingById(movieId)) return true
  if (!tags) return false
  return tags.some((t) => t === 'theatrical' || t === 'now-showing' || t === 'cinema')
}
