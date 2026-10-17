// Facts and text for the About view (AboutView.qml), kept out of QML so node
// can check them (tests/model.test.cjs) and Python can check the privacy text
// against every host the bridge may reach (tests/test_bridge.py).
//
// The version comes from manifest.json and the license from LICENSE at run
// time, so neither is copied here and neither can drift from the real file.

var NAME = "Pocket Casts"
var TAGLINE = "Pocket Casts in the Omarchy bar: Up Next, in-progress and new episodes through mpv, your shows, and your listening position in sync."
var ORGANIZATION = "Nine Point Labs"
var CREATED = "October 2026" // first commit: 2026-10-01
var SUPPORT_EMAIL = "help@ninepointlabs.com"

// Must stay true to what the plugin does. Network: only bin/pocketcasts-bridge
// (API, SHOW_HOSTS, ART_HOST_RE), mpv streaming the episode's own audio URL,
// and the panel showing a cover straight from static.pocketcasts.com when it
// could not be cached. Files: auth.json, playback.json, prefs.json,
// podcasts-cache.json (all 0600), the art cache, shell.json.
var PRIVACY = "No telemetry and no Nine Point Labs servers: the plugin talks only to Pocket Casts and "
  + "to the podcasts you play. Your email and password go to api.pocketcasts.com once, at sign-in; the "
  + "password is never stored. With your login token, api.pocketcasts.com then serves your Up Next, "
  + "in-progress and new episodes and your shows, and receives your changes: queueing, marking played, "
  + "and your listening position (episode, show, position, duration and played state), sent every 30 "
  + "seconds while playing and when you pause, stop or switch. Episode lists come from "
  + "podcast-api.pocketcasts.com, podcasts.pocketcasts.com and cache.pocketcasts.com, and cover art "
  + "from static.pocketcasts.com, all without your token. Audio streams through mpv straight from each "
  + "podcast's own server (the address in its feed), which sees your IP address as with any podcast "
  + "app. Your login tokens, email and account ID are kept in ~/.local/state/omarchy-pocketcasts/auth.json, "
  + "readable only by you (0600), next to the episode loaded, your volume and speed, and a 10-minute "
  + "list of your shows; signing out deletes the tokens. Cover art is cached in "
  + "~/.cache/omarchy-pocketcasts/art, and the tab you last opened is saved in ~/.config/omarchy/shell.json."

// "0.1.0" from manifest.json's text, or "" when it can't be read.
function manifestVersion(text) {
  try {
    var v = JSON.parse(String(text || "")).version
    return typeof v === "string" && /^[0-9A-Za-z.+-]{1,32}$/.test(v) ? v : ""
  } catch (e) {
    return ""
  }
}

// "MIT License, © 2026 Nine Point Labs" from LICENSE's text: its first line
// plus its copyright line, as written there.
function licenseSummary(text) {
  var lines = String(text || "").split("\n")
  var name = ""
  var holder = ""
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim()
    if (line === "") continue
    if (name === "") name = line
    var m = /^Copyright\s+(?:\(c\)|©)\s*(.+)$/i.exec(line)
    if (m) { holder = "© " + m[1]; break }
  }
  return holder ? name + ", " + holder : name
}

// LICENSE with one line per paragraph, so it wraps to the panel's width.
function licenseBody(text) {
  var paras = String(text || "").replace(/\r/g, "").split(/\n\s*\n/)
  var out = []
  for (var i = 0; i < paras.length; i++) {
    var p = paras[i].split(/\s+/).join(" ").trim()
    if (p !== "") out.push(p)
  }
  return out.join("\n\n")
}

// Highest minor version `has(major, minor)` accepts, as "major.minor"
// (Quickshell.hasVersion / hasQtVersion only answer yes or no), or "".
function probedVersion(has, major) {
  if (typeof has !== "function" || !has(major, 0)) return ""
  var minor = 0
  while (minor < 99 && has(major, minor + 1)) minor++
  return major + "." + minor
}

// { quickshell, qt, python } -> "Quickshell 0.3, Qt 6.11, Python 3.14.7".
function builtWith(v) {
  var out = []
  if (v && v.quickshell) out.push("Quickshell " + v.quickshell)
  if (v && v.qt) out.push("Qt " + v.qt)
  if (v && v.python) out.push("Python " + v.python)
  return out.length ? out.join(", ") + " and mpv" : "Quickshell, Qt, Python and mpv"
}

// Version details to paste into a support email.
function details(version, v, desktop) {
  return "Omarchy " + NAME + " plugin " + (version || "unknown version") + "\n"
    + builtWith(v) + "\n"
    + (desktop || "unknown desktop")
}

function mailto(version, detailText) {
  return "mailto:" + SUPPORT_EMAIL
    + "?subject=" + encodeURIComponent("Omarchy " + NAME + " plugin " + (version || ""))
    + "&body=" + encodeURIComponent("\n\n--\n" + detailText)
}

if (typeof module !== "undefined") {
  module.exports = {
    NAME: NAME, TAGLINE: TAGLINE, ORGANIZATION: ORGANIZATION, CREATED: CREATED,
    SUPPORT_EMAIL: SUPPORT_EMAIL, PRIVACY: PRIVACY,
    manifestVersion: manifestVersion, licenseSummary: licenseSummary, licenseBody: licenseBody,
    probedVersion: probedVersion, builtWith: builtWith, details: details, mailto: mailto
  }
}
