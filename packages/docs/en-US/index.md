---
layout: home
title: vodtv
titleTemplate: Fast · HD · Ad-free

hero:
  name: Watch Freely, Enjoy the Best
  text: A fully-featured video aggregation search and playback platform, deeply customized
  tagline: 60+ major feature enhancements to help you build the ultimate online viewing experience.
  subtitle: Agents • Bots • Knowledge Base • File Parsing • Multimedia Generation • Workflows
  mockUrl: ""
  image:
    src: "/screenshot2.png"
    alt: "All-in-one modular AI"
  actions:
    - theme: brand
      text: Quick Start
      link: /en-US/guide/quick-start
    - theme: alt
      text: View on GitHub
      link: https://github.com/Vodtv/vodtv
      target: _blank
    - theme: alt
      text: View Vodtv
      link: /en-US/vodtv/

features:
  - icon: rocket-launch
    color: blue
    title: Rapid Setup
    details: Simple configuration to quickly launch your video site.
  - icon: paint-brush
    color: purple
    title: Clean Player UI
    details: Beautiful media interface with light and dark theme switching.
  - icon: globe-alt
    color: green
    title: Multi-language Support
    details: Built for a global audience—easily add more languages.
  - icon: device-phone-mobile
    color: orange
    title: Cross-device Adaptation
    details: Works perfectly on desktop, tablet, and mobile.
  - icon: "rocket-launch"
    color: amber
    title: Ultra-fast Streaming
    details: Low-latency video streaming with rapid movie loading.
  - icon: magnifying-glass
    color: indigo
    title: Media Retrieval
    details: One-click search for movies and TV series.
  - icon: magnifying-glass
    color: blue
    title: Aggregated Search
    details: Parallel search across multiple scraper sites; a single-source failure never affects the whole, and users' IPs are never exposed to third parties.
  - icon: paint-brush
    color: purple
    title: Cross-source Title Aggregation
    details: Same-title films are merged into a single card—expand it to compare and choose from each source.
  - icon: globe-alt
    color: green
    title: HLS Playback
    details: ArtPlayer + hls.js core, with ad-segment filtering, auto-play, playback speed, and keyboard shortcuts.
  - icon: device-phone-mobile
    color: orange
    title: Instant Resume
    details: Playback progress and watch history are stored locally in IndexedDB, resuming precisely to the second.
  - icon: academic-cap
    color: amber
    title: Source Switching & Speed Test
    details: The project developers are not responsible for any consequences arising from the use of this project.
  - icon: paint-brush
    color: indigo
    title: Source Testing & Subscriptions
    details: For learning and personal use only; do not use for commercial purposes or public services.

featuresConfig:
  title: Why Choose VODTV?
  description: Helping you build the ultimate on-demand and video playback media platform
  extraSection:
    title: Get Started Now
    description: Just 3 simple steps to build your own video site
    tags:
      - Rapid Setup
      - Clean Player UI
      - TypeScript Support
      - Multiple Layouts
      - Multi-language
      - Responsive Design

quickStart:
  badge: 5-minute Deployment
  title: Quick Start
  subtitle: Easy Deployment
  description: Deploy in just a few simple steps with Docker (recommended)
  steps:
    - step: "Step 1"
      icon: "arrow-down-tray"
      color: "blue"
      title: "Clone the Project"
      description: "Download via git and install quickly"
      code: |
        git clone https://github.com/SzeMeng76/LunaTV.git
        cd LunaTV
    - step: "Step 2"
      icon: "cog-8-tooth"
      color: "green"
      title: "Configure Required Environment Variables"
      description: "Edit the .env file"
      code: |
        cp .env.example .env
        nano .env
    - step: "Step 3"
      icon: "rocket-launch"
      color: "purple"
      title: "Start the Service"
      description: "Start the docker-compose service"
      code: |
        docker-compose up -d
        # Visit  to start using it
  helpText: "Need help? Check out our detailed documentation"
  helpLink: "/en-US/guide/quick-start"
  helpLinkText: "Quick Start Guide"
---
