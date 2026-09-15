---
layout: home
title: vodtv
titleTemplate: vodtv docs

hero:
  name: VODTV
  text: A full media play platform for secondary development
  tagline: 60+ features, great movie watching experience
  subtitle: 🎬 New Release
  mockUrl: "https://www.vodtv.cn" 
  image:
    src: "/screenshot2.png"
    alt: "secondary development "
  actions:
    - theme: brand
      text: Quick Start
      link: /en-US/guide/quick-start
    - theme: alt
      text: View on GitHub
      link: https://github.com/vodtv/vodtv
      target: _blank
    - theme: alt
      text: View Guide
      link: /en-US/guide/

features:
  - icon: rocket-launch
    color: blue
    title: Quick Setup
    details: Build your video site fast with simple settings.
    link: /en-US/guide/quick-start
  - icon: paint-brush
    color: purple
    title: Clean Player UI
    details: Nice media interface, switch light or dark mode.
    link: /en-US/guide/custom-style
  - icon: globe-alt
    color: green
    title: Multi-language
    details: Serve users worldwide, easy to add new languages.
    link: /en-US/guide/i18n
  - icon: device-phone-mobile
    color: orange
    title: Cross Device
    details: Watch videos smoothly on phone, pad and PC.
  - icon: bolt
    color: amber
    title: Fast Stream
    details: Low delay video stream, load movies quickly.
  - icon: magnifying-glass
    color: indigo
    title: Media Search
    details: Search movies and TV shows in one click.

featuresConfig:
  title: Why Choose VODTV?
  description: A media platform built for VOD and video playback
  extraSection:
    title: Get Started Now
    description: Build your own video website in just 3 simple steps
    tags:
      - Quick Setup
      - Clean Player UI
      - TypeScript Support
      - Multiple Layouts
      - Multi-language
      - Responsive Design


quickStart:
  badge: 5-minute Setup
  title: Quick Start
  subtitle: Easy Deploy
  description: Deploy with Docker in just a few simple steps (Recommended)
  steps:
    - step: "01"
      icon: "arrow-down-tray"
      color: "blue"
      title: "Clone Project"
      description: "Download via git and install quickly"
      code: |
        git clone https://github.com/SzeMeng76/LunaTV.git
        cd LunaTV
    - step: "02"
      icon: "cog-8-tooth"
      color: "green"
      title: "Set Env Variables"
      description: "Edit your .env file"
      code: |
        cp .env.example .env
        nano .env
    - step: "03"
      icon: "rocket-launch"
      color: "purple"
      title: "Start Service"
      description: "Start  http://localhost:3000 "
      code: "docker-compose up -d"
  helpText: "Need help? Read our full docs"
  helpLink: "/en-US/guide/quick-start"
  helpLinkText: "Quick Start Guide"
---