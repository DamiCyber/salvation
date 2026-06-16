/**
 * mediaServer.js
 * Node Media Server — receives RTMP from OBS and serves HLS.
 *
 * OBS Settings:
 *   Service:    Custom
 *   Server:     rtmp://localhost/live
 *   Stream Key: salvation
 *
 * HLS stream URL: http://localhost:8000/live/salvation/index.m3u8
 *
 * ffmpeg path: auto-detected from winget install location
 */
const NodeMediaServer = require('node-media-server');
const path            = require('path');
const fs              = require('fs');

const HLS_DIR    = path.join(__dirname, 'media');
const FFMPEG_BIN = process.env.FFMPEG_PATH ||
  'C:\\Users\\user\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.1-full_build\\bin\\ffmpeg.exe';

if (!fs.existsSync(HLS_DIR)) fs.mkdirSync(HLS_DIR, { recursive: true });

const config = {
  logType: 1, // 0=nothing, 1=errors, 2=debug
  rtmp: {
    port:         1935,
    chunk_size:   60000,
    gop_cache:    true,
    ping:         60,
    ping_timeout: 30,
  },
  http: {
    port:         8000,
    mediaroot:    HLS_DIR,
    allow_origin: '*',
  },
  trans: {
    ffmpeg: FFMPEG_BIN,
    tasks: [
      {
        app:      'live',
        hls:      true,
        // keep=true means HLS segments stay alive even when no RTMP viewer is watching
        hlsFlags: '[hls_time=2:hls_list_size=6:hls_flags=delete_segments]',
        hlsKeep:  true,
        vc:       'copy',
        ac:       'copy',
      },
    ],
  },
};

const nms = new NodeMediaServer(config);

module.exports = nms;
