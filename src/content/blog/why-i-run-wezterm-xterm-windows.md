---
title: "Why I Run WezTerm + XTerm on Windows"
date: "2026-07-02"
authors:
  - iago-mussel
description: "Most terminal emulators on Windows claim xterm compatibility and quietly break when it matters. WezTerm is the rare one that actually delivers it."
tags:
  - WezTerm
  - XTerm
  - Windows
  - Terminal
  - Developer Tools
  - WSL
keywords:
  - wezterm windows
  - xterm terminal emulator
  - wezterm vs windows terminal
  - best terminal for windows
  - wsl terminal setup
  - wezterm xterm 256color
subtitle: "Your terminal is probably lying about what it supports"
status: "draft"
---

Your terminal is probably lying to you.

Most terminal emulators on Windows claim they support `xterm-256color`. They don't — not really. They support enough of it to make `ls --color` look nice, then quietly fall apart the moment you open something serious. Neovim with multiple splits. A tmux status bar. Any TUI that expects the terminal to mean what it says.

It's not that Windows is bad for development. It's that the window you type into is pretending to be a better terminal than it is.

<!-- truncate -->

## What "xterm-compatible" actually means

XTerm isn't just old software from the X11 era. It's the reference implementation. When a terminal says it's xterm-compatible, applications expect a specific set of escape sequences, key reports, and color behaviors. That's the contract.

Break the contract and you get the small glitches that waste your day: arrow keys that emit the wrong codes, mouse events that never register, colors that render differently across panes, status bars that leave ghost characters behind. Each glitch is tiny. Together they make the terminal feel unreliable.

A lot of Windows terminals sign the contract without reading it. They set `TERM=xterm-256color` because that's what apps want to see, then hope the app doesn't ask for anything complicated. Hope is a bad terminal strategy.

## Windows Terminal isn't enough

Windows Terminal has gotten better. Tabs, decent font rendering, GPU acceleration. For casual PowerShell work or running the occasional WSL command, it's fine.

But fine isn't the same as correct. Windows Terminal still intercepts keys in weird ways, renders some escape sequences differently than xterm, and has quirks when you mix native Windows shells with WSL. It tries to be everything — a shell launcher, a settings UI, a tab manager — and ends up mediocre at the actual terminal protocol.

If you spend most of your day in a terminal, mediocre isn't acceptable. You need an emulator that treats the protocol seriously.

## What WezTerm gets right

WezTerm is a cross-platform terminal emulator written in Rust. That alone isn't why I use it. I use it because it actually implements the terminal protocol correctly.

It understands the same escape sequences xterm does. It reports itself accurately. You can set `TERM=wezterm` and get a terminfo that matches the emulator, or use `xterm-256color` and know the sequences will land the way applications expect. Either way, the contract holds.

It also renders text well, supports ligatures, has real color scheme support, and handles high-DPI displays without looking like a science experiment. The basics, done right.

## You already own a multiplexer

Here's the part that surprises people: WezTerm has a built-in multiplexer.

Tabs, split panes, workspaces, even remote sessions over SSH. You can do a lot of what tmux gives you without running a separate program inside every window. That means fewer layers, fewer key conflicts, and one less thing to install and configure.

I still use tmux on servers where I need persistence after disconnecting. But for local development, WezTerm's mux is enough. One config file. One process. One set of key bindings that actually work the same on macOS, Linux, and Windows.

## Even on Windows

The real argument isn't that WezTerm is good on Unix. It's that WezTerm makes Windows feel like a proper development machine.

Install the native Windows build and it just runs. No WSL required. It talks to PowerShell, CMD, Git Bash, MSYS2, and WSL equally well. You can define a launch menu in Lua and pick your shell per tab. Your config file is the same one you use on your MacBook or your Linux box, with small per-platform overrides if you need them.

That portability matters. You stop maintaining one terminal setup for work and another for home. You stop explaining to Windows teammates why their terminal "almost" works.

## The config that travels with you

WezTerm is configured in Lua. One file, usually `~/.config/wezterm/wezterm.lua`, copied anywhere.

You set your font, your color scheme, your leader key, your launch menu, your pane splits. You can detect the platform and adjust paths. After a day of tweaking, you have a terminal that behaves identically across every machine you touch.

There's no registry editing. No JSON settings UI that moved between versions. No mystery checkboxes. Just text you can version control.

## What to do next

Download WezTerm. Set your `TERM` to `xterm-256color` or `wezterm`. Copy your dotfiles over. Open your usual TUI apps and notice how many small annoyances disappear.

Stop apologizing for your terminal. Get one that means what it says.
