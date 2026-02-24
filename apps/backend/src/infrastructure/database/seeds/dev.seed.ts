import argon2 from "argon2";
import { uuidv7 } from "uuidv7";
import { makePrismaClient } from "@/main/factories/prisma";

const DEV_USERS = [
  { name: "Alice Silva", email: "alice@example.com", password: "password123" },
  { name: "Bob Santos", email: "bob@example.com", password: "password123" },
  {
    name: "Charlie Johnson",
    email: "charlie@example.com",
    password: "password123"
  },
  {
    name: "Diana Rodriguez",
    email: "diana@example.com",
    password: "password123"
  },
  {
    name: "Eduardo Ferreira",
    email: "eduardo@example.com",
    password: "password123"
  }
];

const DEV_MOVIES = [
  {
    title: "The Matrix",
    originalTitle: "The Matrix",
    tagline: "Welcome to the Real World",
    synopsis:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    releaseDate: new Date("1999-03-31"),
    runtime: 136,
    status: "RELEASED" as const,
    ageRating: "FOURTEEN" as const,
    budget: 63000000,
    revenue: 463517383,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Action", "Science Fiction"]
  },
  {
    title: "Cidade de Deus",
    originalTitle: "City of God",
    tagline:
      "If you run, the beast catches you. If you stay, the beast eats you.",
    synopsis:
      "In the slums of Rio, two kids paths diverge as one struggles to become a photographer and the other a crime lord.",
    releaseDate: new Date("2002-08-30"),
    runtime: 130,
    status: "RELEASED" as const,
    ageRating: "EIGHTEEN" as const,
    budget: 3300000,
    revenue: 30680000,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/gfnXixcGC060QcG6JPxN6AMdVsq.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/uvitbjFU4JqvMwIkMWHp69bmUzG.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=dcUOO4Itgmw",
    votes: 0,
    score: 0,
    languageCode: "pt",
    genres: ["Drama", "Crime"]
  },
  {
    title: "A Viagem de Chihiro",
    originalTitle: "千と千尋の神隠し",
    tagline: "Everyone has a destiny.",
    synopsis:
      "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.",
    releaseDate: new Date("2001-07-20"),
    runtime: 125,
    status: "RELEASED" as const,
    ageRating: "L" as const,
    budget: 19000000,
    revenue: 395802070,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/ukfI9QkU1aIhOhKXYWE9n3z1mFR.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=ByXuk9QqQkk",
    votes: 0,
    score: 0,
    languageCode: "ja",
    genres: ["Animation", "Family", "Fantasy"]
  },
  {
    title: "Parasita",
    originalTitle: "기생충",
    tagline: "Act like you own the place.",
    synopsis:
      "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    releaseDate: new Date("2019-05-30"),
    runtime: 132,
    status: "RELEASED" as const,
    ageRating: "SIXTEEN" as const,
    budget: 11400000,
    revenue: 266900000,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=5xH0HfJHsaY",
    votes: 0,
    score: 0,
    languageCode: "ko",
    genres: ["Comedy", "Thriller", "Drama"]
  },
  {
    title: "Interestelar",
    originalTitle: "Interstellar",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    synopsis:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseDate: new Date("2014-11-07"),
    runtime: 169,
    status: "RELEASED" as const,
    ageRating: "TEN" as const,
    budget: 165000000,
    revenue: 701729206,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/2ssWTSVklAEc98frZUQhgtGHx7s.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Adventure", "Drama", "Science Fiction"]
  },
  {
    title: "Um Sonho de Liberdade",
    originalTitle: "The Shawshank Redemption",
    tagline: "Fear can hold you prisoner. Hope can set you free.",
    synopsis:
      "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden.",
    releaseDate: new Date("1994-09-23"),
    runtime: 142,
    status: "RELEASED" as const,
    ageRating: "FOURTEEN" as const,
    budget: 25000000,
    revenue: 16000000,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=6hB3S9bIaco",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Drama", "Crime"]
  },
  {
    title: "O Poderoso Chefão",
    originalTitle: "The Godfather",
    tagline: "An offer you can't refuse.",
    synopsis:
      "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When patriarch Vito Corleone barely survives an attempt on his life, his youngest son, Michael, steps in to take care of the family business.",
    releaseDate: new Date("1972-03-14"),
    runtime: 175,
    status: "RELEASED" as const,
    ageRating: "FOURTEEN" as const,
    budget: 6000000,
    revenue: 245066411,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/oJagOzBu9Rdd9BrciseCm3U3MCU.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/tSPT36ZKlP2WVHJLM4cQPLSzv3b.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=sY1S34973zA",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Drama", "Crime"]
  },
  {
    title: "Batman: O Cavaleiro das Trevas",
    originalTitle: "The Dark Knight",
    tagline: "Why so serious?",
    synopsis:
      "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
    releaseDate: new Date("2008-07-18"),
    runtime: 152,
    status: "RELEASED" as const,
    ageRating: "TWELVE" as const,
    budget: 185000000,
    revenue: 1004558444,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Action", "Crime", "Drama", "Thriller"]
  },
  {
    title: "Pulp Fiction",
    originalTitle: "Pulp Fiction",
    tagline:
      "Just because you are a character doesn't mean you have character.",
    synopsis:
      "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
    releaseDate: new Date("1994-10-14"),
    runtime: 154,
    status: "RELEASED" as const,
    ageRating: "EIGHTEEN" as const,
    budget: 8000000,
    revenue: 213928762,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/4EYPN5mVIhKLfxGruy7Dy41dTVn.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Thriller", "Crime"]
  },
  {
    title: "A Lista de Schindler",
    originalTitle: "Schindler's List",
    tagline: "Whoever saves one life, saves the world entire.",
    synopsis:
      "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slave labour in his factory during World War II.",
    releaseDate: new Date("1993-11-30"),
    runtime: 195,
    status: "RELEASED" as const,
    ageRating: "FOURTEEN" as const,
    budget: 22000000,
    revenue: 321365567,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/loRmRzQXZeqG78TqZuyvSlEQfZb.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=gG22XNhtnoY",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Drama", "History", "War"]
  },
  {
    title: "A Origem",
    originalTitle: "Inception",
    tagline: "Your mind is the scene of the crime.",
    synopsis:
      "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: inception, the implantation of another person's idea into a target's subconscious.",
    releaseDate: new Date("2010-07-16"),
    runtime: 148,
    status: "RELEASED" as const,
    ageRating: "TWELVE" as const,
    budget: 160000000,
    revenue: 836836967,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Action", "Science Fiction", "Adventure"]
  },
  {
    title: "Forrest Gump: O Contador de Histórias",
    originalTitle: "Forrest Gump",
    tagline:
      "Life is like a box of chocolates...you never know what you're gonna get.",
    synopsis:
      "A man with a low IQ has accomplished great things in his life and been present during significant historic events — in each case, far exceeding what anyone imagined he could do. But despite all he has achieved, his one true love eludes him.",
    releaseDate: new Date("1994-07-06"),
    runtime: 142,
    status: "RELEASED" as const,
    ageRating: "TWELVE" as const,
    budget: 55000000,
    revenue: 678226133,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/qdIMHd4sEfJSckfVJfKQvisL02a.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=bLvqoHBptjg",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Comedy", "Drama", "Romance"]
  },
  {
    title: "Clube da Luta",
    originalTitle: "Fight Club",
    tagline: "Mischief. Mayhem. Soap.",
    synopsis:
      "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground fight clubs forming in every town, until a sensuous babe named Marla, starts coming around.",
    releaseDate: new Date("1999-10-15"),
    runtime: 139,
    status: "RELEASED" as const,
    ageRating: "EIGHTEEN" as const,
    budget: 63000000,
    revenue: 100853753,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/52AfXWuXCHn3UjD17rBruA9f5qb.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=SUXWAEX2jlg",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Drama", "Thriller"]
  },
  {
    title: "O Silêncio dos Inocentes",
    originalTitle: "The Silence of the Lambs",
    tagline:
      "To enter the mind of a killer she must challenge the mind of a madman.",
    synopsis:
      "Clarice Starling is a top student at the FBI's training academy. Jack Crawford wants Clarice to interview Dr. Hannibal Lecter, a brilliant psychiatrist who is also a violent psychopath serving life behind bars, to gain insight on a serial killer who skins his victims.",
    releaseDate: new Date("1991-02-14"),
    runtime: 118,
    status: "RELEASED" as const,
    ageRating: "SIXTEEN" as const,
    budget: 19000000,
    revenue: 272742922,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/9IflTrxN8yw44ZxhfvJPziGzGHM.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/aYcnDyLMnpKce1FOYUpZrXtgUye.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=W6Mm8Sbe__o",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Crime", "Drama", "Thriller"]
  },
  {
    title: "O Senhor dos Anéis: A Sociedade do Anel",
    originalTitle: "The Lord of the Rings: The Fellowship of the Ring",
    tagline: "One Ring to rule them all.",
    synopsis:
      "Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in order to keep it from falling into the hands of its evil creator. Along the way, a fellowship is formed to protect the ring bearer.",
    releaseDate: new Date("2001-12-19"),
    runtime: 179,
    status: "RELEASED" as const,
    ageRating: "TWELVE" as const,
    budget: 93000000,
    revenue: 871368364,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=V75dMMIW2B4",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Adventure", "Fantasy", "Action"]
  },
  {
    title: "Titanic",
    originalTitle: "Titanic",
    tagline: "Nothing on Earth could come between them.",
    synopsis:
      "101-year-old Rose DeWitt Bukater tells the story of her life aboard the Titanic, 84 years later. A young Rose boards the ship with her mother and fiancé. Meanwhile, Jack Dawson and Fabrizio De Rossi win third-class tickets to the ship in a game. Rose and Jack soon fall in love.",
    releaseDate: new Date("1997-12-19"),
    runtime: 194,
    status: "RELEASED" as const,
    ageRating: "TWELVE" as const,
    budget: 200000000,
    revenue: 2187463944,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/As0zX43h3w6kD2NS4uVHu9HKdEh.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/xnHVX37XZEp33hhCbYlQFq7ux1J.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=2e-eXJ6HgkQ",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Drama", "Romance"]
  },
  {
    title: "Os Bons Companheiros",
    originalTitle: "GoodFellas",
    tagline: "Three Decades of Life in the Mafia.",
    synopsis:
      "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.",
    releaseDate: new Date("1990-09-19"),
    runtime: 145,
    status: "RELEASED" as const,
    ageRating: "SIXTEEN" as const,
    budget: 25000000,
    revenue: 46836394,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/sw7mordbZxgITU877yTpZCud90M.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=qo5jJpHtI1Y",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Crime", "Drama"]
  },
  {
    title: "Avatar",
    originalTitle: "Avatar",
    tagline: "Enter the World",
    synopsis:
      "In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization threatened with annihilation.",
    releaseDate: new Date("2009-12-18"),
    runtime: 162,
    status: "RELEASED" as const,
    ageRating: "TEN" as const,
    budget: 237000000,
    revenue: 2923706026,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/o0s4XsEDfDlvit5pDRKjzXR4pp2.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=5PSNL1qE6VY",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Action", "Adventure", "Science Fiction"]
  },
  {
    title: "Jurassic Park",
    originalTitle: "Jurassic Park",
    tagline: "An adventure 65 million years in the making.",
    synopsis:
      "A wealthy entrepreneur secretly creates a theme park featuring living dinosaurs drawn from prehistoric DNA. Before opening day, he invites a team of experts and his two eager grandchildren to experience the park — and soon discovers the dinosaurs of Jurassic Park are out to prove they're not just attractions.",
    releaseDate: new Date("1993-06-11"),
    runtime: 127,
    status: "RELEASED" as const,
    ageRating: "TEN" as const,
    budget: 63000000,
    revenue: 1037362283,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/mgjJ7FH4V3exsmoHwXrmsUhn0h1.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/alqZDg4DXBpNCVTzRPXe5zkkAXX.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=lc0UehYemQA",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Adventure", "Science Fiction"]
  },
  {
    title: "De Volta para o Futuro",
    originalTitle: "Back to the Future",
    tagline: "He's the only kid ever to get into trouble before he was born.",
    synopsis:
      "Eighties teenager Marty McFly is accidentally sent back in time to 1955, inadvertently disrupting his parents' first meeting and attracting his mother's romantic interest. To return to 1985, he must fix this mess and somehow get back to the future.",
    releaseDate: new Date("1985-07-03"),
    runtime: 116,
    status: "RELEASED" as const,
    ageRating: "L" as const,
    budget: 19000000,
    revenue: 388758763,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/jIq6VLvkl3APntb552IFhSq3VEg.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/qskzmLTbarKnXDbo2HRj4NJ3vcW.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=qvsgGtivCgs",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Adventure", "Comedy", "Science Fiction"]
  },
  {
    title: "Blade Runner 2049",
    originalTitle: "Blade Runner 2049",
    tagline: "The key to the future is finally unearthed.",
    synopsis:
      "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos. K's discovery leads him on a quest to find Rick Deckard, a former LAPD blade runner who has been missing for 30 years.",
    releaseDate: new Date("2017-10-05"),
    runtime: 164,
    status: "RELEASED" as const,
    ageRating: "FOURTEEN" as const,
    budget: 150000000,
    revenue: 259239658,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/ilRyazdMJwN05exqhwK4tMKBYZs.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=gCcx85zbxz4",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Science Fiction", "Drama", "Mystery"]
  },
  {
    title: "La La Land: Cantando Estações",
    originalTitle: "La La Land",
    tagline: "Here's to the fools who dream.",
    synopsis:
      "Mia, an aspiring actress, serves lattes to movie stars in between auditions and Sebastian, a jazz musician, scrapes by playing cocktail bar gigs in dingy bars. But when Sebastian and Mia meet, they find themselves falling in love while pursuing their dreams in a city that's never been kind to either of them.",
    releaseDate: new Date("2016-11-29"),
    runtime: 128,
    status: "RELEASED" as const,
    ageRating: "L" as const,
    budget: 30000000,
    revenue: 446486224,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/AvMietG6xuobpSSdmVnKuTjv4bL.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/nlPCdZlHtRNcF6C9hzUH4ebmV1w.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=0pdqf4P9MB8",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Drama", "Music", "Romance"]
  },
  {
    title: "Oppenheimer",
    originalTitle: "Oppenheimer",
    tagline: "The world forever changes.",
    synopsis:
      "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II. Based on the Pulitzer Prize-winning book American Prometheus.",
    releaseDate: new Date("2023-07-21"),
    runtime: 181,
    status: "RELEASED" as const,
    ageRating: "FOURTEEN" as const,
    budget: 100000000,
    revenue: 952000000,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Drama", "History"]
  },
  {
    title: "Tudo em Todo o Lugar ao Mesmo Tempo",
    originalTitle: "Everything Everywhere All at Once",
    tagline: "The universe is so much bigger than you realize.",
    synopsis:
      "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what's important to her by connecting with the lives she could have led in other universes.",
    releaseDate: new Date("2022-04-08"),
    runtime: 139,
    status: "RELEASED" as const,
    ageRating: "FOURTEEN" as const,
    budget: 14300000,
    revenue: 69000000,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/ss0Os3uWJfQAENILHZUdX8Tt1OC.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=wxN1T1uxQ2g",
    votes: 0,
    score: 0,
    languageCode: "en",
    genres: ["Action", "Adventure", "Science Fiction", "Comedy"]
  },
  {
    title: "O Fabuloso Destino de Amélie Poulain",
    originalTitle: "Le Fabuleux Destin d'Amélie Poulain",
    tagline: "She'll change your life.",
    synopsis:
      "At a tiny Parisian café, the adorable yet painfully shy Amélie accidentally discovers a gift for helping others. Setting out to transform the lives of those around her, she embarks on a quirky series of adventures — while struggling with her own shyness to find love.",
    releaseDate: new Date("2001-04-25"),
    runtime: 122,
    status: "RELEASED" as const,
    ageRating: "TWELVE" as const,
    budget: 10000000,
    revenue: 173921954,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/oAYKYALxamhAB1wKUGmOo05Vf92.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/6n53UI4mX9QMfe2S0Pgt8mGebY1.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=HkBZAJim7r0",
    votes: 0,
    score: 0,
    languageCode: "fr",
    genres: ["Comedy", "Romance"]
  },
  {
    title: "Os Sete Samurais",
    originalTitle: "七人の侍",
    tagline:
      "The Mighty Warriors Who Became the Seven National Heroes of a Small Town.",
    synopsis:
      "A veteran samurai, who has fallen on hard times, answers a poor village's request for protection after he falls on hard times. Gathering six other samurais to help him, they teach the townspeople how to defend themselves and then, together, defend the village against the bandits.",
    releaseDate: new Date("1954-04-26"),
    runtime: 207,
    status: "RELEASED" as const,
    ageRating: "TEN" as const,
    budget: 125000,
    revenue: 2500000,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/2f3Aw6GCzpn1qw56xq78dH0VBgn.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/qvZ91FwMq6O47VViAr8vZNQz3WI.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=FIFIutfajFU",
    votes: 0,
    score: 0,
    languageCode: "ja",
    genres: ["Action", "Adventure", "Drama"]
  },
  {
    title: "O Labirinto do Fauno",
    originalTitle: "El laberinto del fauno",
    tagline: "Innocence has a power evil cannot imagine.",
    synopsis:
      "Living with her tyrannical stepfather in a new home with her pregnant mother, 10-year-old Ofelia finds an escape from reality when she explores an eerie but captivating fantasy world. In the labyrinth she meets a faun who tells her she is a princess and must complete three tasks to reclaim her kingdom.",
    releaseDate: new Date("2006-10-11"),
    runtime: 119,
    status: "RELEASED" as const,
    ageRating: "SIXTEEN" as const,
    budget: 13500000,
    revenue: 83258226,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/5hMcZCR8qpJzeebm38Zi68XwcoA.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/6G6nqSW9S7EHA9HrYl0Z8uo2H7f.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=DFElnxfDaGs",
    votes: 0,
    score: 0,
    languageCode: "es",
    genres: ["Drama", "Fantasy", "Thriller"]
  }
];

export async function seedDev() {
  const prisma = makePrismaClient();
  const now = new Date();

  // Seed users
  const userIds: string[] = [];
  for (const { name, email, password } of DEV_USERS) {
    const id = uuidv7();
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        id,
        name,
        email,
        password: await argon2.hash(password, { type: argon2.argon2id }),
        createdAt: now,
        updatedAt: now
      }
    });
    const user = await prisma.user.findUnique({ where: { email } });
    userIds.push(user!.id);
  }

  console.log(`Seeded ${DEV_USERS.length} dev users`);

  // Seed movies
  let movieCount = 0;
  let skippedCount = 0;
  for (const movie of DEV_MOVIES) {
    const { languageCode, genres: genreNames, ...movieData } = movie;

    const existing = await prisma.movie.findFirst({
      where: { title: movieData.title }
    });
    if (existing) {
      skippedCount++;
      continue;
    }

    const language = await prisma.language.findUnique({
      where: { code: languageCode }
    });
    if (!language) {
      console.warn(
        `Language "${languageCode}" not found, skipping movie "${movie.title}"`
      );
      continue;
    }

    const genres = await prisma.genre.findMany({
      where: { name: { in: genreNames } }
    });

    const userId = userIds[movieCount % userIds.length];

    await prisma.movie.create({
      data: {
        id: uuidv7(),
        ...movieData,
        languageId: language.id,
        userId,
        createdAt: now,
        updatedAt: now,
        genres: { connect: genres.map((g) => ({ id: g.id })) }
      }
    });

    movieCount++;
  }

  if (skippedCount > 0) {
    console.log(`Skipped ${skippedCount} already existing movies`);
  }
  console.log(`Seeded ${movieCount} dev movies`);

  // Seed ratings — one per user per movie
  const movies = await prisma.movie.findMany({ select: { id: true } });
  let ratingCount = 0;

  for (const movie of movies) {
    const values: number[] = [];

    for (const userId of userIds) {
      const existing = await prisma.rating.findUnique({
        where: { userId_movieId: { userId, movieId: movie.id } }
      });
      if (existing) continue;

      const value = Math.floor(Math.random() * 10) + 1;
      await prisma.rating.create({
        data: {
          id: uuidv7(),
          userId,
          movieId: movie.id,
          value,
          createdAt: now,
          updatedAt: now
        }
      });
      values.push(value);
      ratingCount++;
    }

    if (values.length > 0) {
      const allRatings = await prisma.rating.findMany({
        where: { movieId: movie.id },
        select: { value: true }
      });
      const count = allRatings.length;
      const average =
        allRatings.reduce((sum, r) => sum + r.value, 0) / count;
      await prisma.movie.update({
        where: { id: movie.id },
        data: {
          votes: count,
          score: Math.round(average * 10) / 10
        }
      });
    }
  }

  console.log(`Seeded ${ratingCount} dev ratings`);

  await prisma.$disconnect();
}
