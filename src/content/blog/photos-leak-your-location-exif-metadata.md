---
title: "Your Photos Are Leaking Your Home Address"
date: "2026-07-01"
authors:
  - iago-mussel
description: "Every photo from your phone carries GPS coordinates, camera serial numbers, and timestamps you never see. Here's what's actually hiding in your files, and how to strip it before you post."
tags:
  - Privacy
  - EXIF
  - Metadata
  - Security
keywords:
  - exif metadata privacy
  - remove gps from photos
  - what is exif data
  - strip metadata from photos
  - photo metadata privacy risk
  - remove location from photos
  - metadata stripper
image: "https://assets.huntermussel.com/images/blog/photos-leak-your-location-exif-metadata.webp"
subtitle: "What's actually hiding inside the photo you're about to post, and how to strip it"
status: "published"
---

You take a photo on your phone, post it to a marketplace listing or a group chat, and move on. You didn't type your address anywhere. You didn't tag your location. As far as you're concerned, the photo is just a photo.

It isn't. Baked into that file is a set of GPS coordinates accurate to within a few meters, the exact make and model of your camera, and a timestamp down to the second. None of it is visible in the image. All of it travels with the file by default.

<!-- truncate -->

## What's actually in the file

This data has a name: EXIF, short for Exchangeable Image File Format. Cameras and phones write it into every photo automatically, and most people have never looked at it because nothing in the normal photo-viewing experience shows it to you.

A typical EXIF block from a phone photo includes:

- **GPS latitude and longitude**, often precise enough to identify a specific room in a house
- **Camera make and model**, "iPhone 15 Pro," down to the exact device
- **Date and time taken**, to the second
- **Software version** used to process the image
- **Orientation, lens info, exposure settings**, mostly harmless alone, but they add up to a fingerprint

Sell something on a local marketplace and someone can pull the GPS tag from your listing photo and know which house to show up at. Post a photo from inside your apartment and the timestamp tells a stranger exactly when you weren't home. None of this requires hacking. It requires opening the file in any EXIF viewer, which takes about ten seconds.

## Why this keeps happening

Cameras write GPS data because it's genuinely useful: for organizing your own photo library, for mapping a trip, for tagging where a product shot was taken. The feature isn't malicious. The problem is that it ships on by default, and the platforms people share photos through don't reliably strip it.

Some do. Facebook and Instagram strip most EXIF data on upload. Many messaging apps don't touch it at all. Send a full-resolution photo over email, AirDrop, or a file-sharing link, and the GPS tag rides along untouched. Marketplace apps are inconsistent. You can't assume the platform is protecting you, because half of them aren't, and you have no way to tell which half from the interface.

## Removing metadata isn't the same as removing a watermark

Worth being precise here, because these get conflated constantly: EXIF stripping removes hidden data embedded in the file. It does nothing to a visible watermark burned into the pixels themselves. If you're trying to remove a logo or text overlay someone stamped onto an image, that's a different problem entirely; you're editing pixels, not metadata. Anyone offering to strip "AI watermarks" by cleaning EXIF data is solving a problem you don't have.

What EXIF stripping actually protects against is the invisible stuff: the GPS pin, the device fingerprint, the exact second the shutter clicked. That's the data that puts your home on a map without you ever meaning to share it.

## How to actually strip it

The reliable method is re-encoding the file. Open the image, redraw it fresh, save it as a new file. The re-encoded copy has the same pixels and none of the original metadata, because metadata isn't pixel data. It's a separate block the encoder either writes or doesn't.

You don't need desktop software for this anymore. We built **[a metadata remover](https://huntermussel.com/tools/metadata-remover/)** that runs entirely in your browser. Drop in a photo or video and it shows you exactly what's embedded: GPS coordinates on a map link, camera model, timestamps, all of it. Then it re-encodes a clean copy with none of it. Nothing uploads to a server. The file never leaves your device, which matters if the whole point is that you don't trust where your data ends up.

It handles video too. MP4s and MOVs carry the same category of container metadata, things like creation date, device info, sometimes GPS, and re-encoding strips it the same way.

## What to actually do

Before you post a photo publicly, on a marketplace listing, a forum, a dating profile, anywhere strangers can download the original file, check what's in it. If there's GPS data and you don't want your location attached, strip it before you upload, not after. Once a platform has redistributed the original file, you can't claw it back.

Make it a habit for anything leaving your camera roll headed somewhere public. It costs you fifteen seconds and it closes a hole most people don't know they're leaving open.
