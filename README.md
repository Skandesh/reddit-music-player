# Reddit Music Player

A modern, open-source streaming music web player that sources content from Reddit music communities. This is a complete rewrite and modernization of the original [redditmusicplayer](https://github.com/musicplayer-io/redditmusicplayer) project.

## About

Reddit Music Player automatically discovers and plays music from Reddit's vibrant music communities. Simply browse any music-related subreddit, and the app extracts YouTube and SoundCloud links, creating an instant playlist for you to enjoy.

## Features

- **Stream music from Reddit** - Automatically extracts and plays YouTube/SoundCloud links from any subreddit
- **Curated subreddit library** - Pre-configured with 100+ music subreddits across genres (Electronic, Hip-Hop, Rock, Jazz, and more)
- **Queue management** - Build and manage your playlist with shuffle support
- **Reddit comments** - View and read comments while listening
- **Keyboard shortcuts** - Space to play/pause, arrow keys for navigation and volume
- **Subreddit search** - Find and browse any music subreddit
- **Responsive design** - Works on desktop and mobile
- **Modern UI** - Clean, dark-themed interface built with Tailwind CSS

## Modern Upgrade

This project is a complete modernization of the original [musicplayer-io/redditmusicplayer](https://github.com/musicplayer-io/redditmusicplayer), rebuilt from the ground up with a modern tech stack:

| Original Stack              | Modern Stack               |
| --------------------------- | -------------------------- |
| CoffeeScript                | TypeScript                 |
| Express.js                  | Next.js 16 (App Router)    |
| Pug templates               | React 19                   |
| Less CSS                    | Tailwind CSS v4            |
| jQuery                      | Zustand (state management) |
| Custom build (Grunt)        | Next.js built-in bundling  |
| Redis required              | No external dependencies   |
| SoundCloud API key required | No API keys needed         |

### Key Improvements

- **No API keys required** - Uses Reddit's public JSON API directly
- **No server-side dependencies** - No Redis or external services needed
- **Server-side rendering** - Fast initial page loads with Next.js SSR
- **Type-safe** - Full TypeScript support throughout
- **Modern React patterns** - Hooks, context, and React Query for data fetching
- **Accessible UI** - Built with Radix UI primitives
- **Smooth animations** - GSAP and Lenis for polished interactions

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/music-player-reddit.git
cd music-player-reddit

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start listening!

### Build for Production

```bash
pnpm build
pnpm start
```

## Keyboard Shortcuts

| Key         | Action         |
| ----------- | -------------- |
| `Space`     | Play / Pause   |
| `Shift + →` | Next track     |
| `Shift + ←` | Previous track |
| `Shift + ↑` | Volume up      |
| `Shift + ↓` | Volume down    |
| `M`         | Toggle mute    |
| `Shift + S` | Shuffle queue  |

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/)
- **State**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Video**: [react-youtube](https://github.com/tjallingt/react-youtube), [react-player](https://github.com/cookpete/react-player)

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Original project: [musicplayer-io/redditmusicplayer](https://github.com/musicplayer-io/redditmusicplayer) by Ilias Ismanalijev
- All the amazing music communities on Reddit
