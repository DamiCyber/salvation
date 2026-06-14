/**
 * mediaServer.js
 * Node Media Server — receives RTMP from OBS and transcodes to HLS
 * so the browser can play the stream natively.
 *
 * OBS Settings:
 *   Service:  Custom
 *   Server:   rtmp://localhost/live
 *   Stream Key: salvation   (or any key you choose)
 *
 * The HLS stream will be available at:
 *   http://localhost:8000/live/salvation/index.m3u8
 *
 * IMPORTANT: ffmpeg must be installed on this machine.
 *   Windows: https://www.gyan.dev/ffmpeg/builds/ → add to PATH
 *   Or:      winget install ffmpeg
 */
const NodeMediaServer = require('node-media-server');
const path            = require('path');
const fs              = require('fs');

// Directory where HLS segments will be written
const HLS_DIR = path.join(__dirname, 'media');
if (!fs.existsSync(HLS_DIR)) fs.mkdirSync(HLS_DIR, { recursive: true });

const config = {
  rtmp: {
    port:       1935,
    chunk_size: 60000,
    gop_cache:  true,
    ping:       30,
    ping_timeout: 60,
  },
  http: {
    port:        8000,
    mediaroot:   HLS_DIR,
    allow_origin: '*',
  },
  trans: {
    ffmpeg: process.env.FFMPEG_PATH || 'ffmpeg', // must be in PATH or set FFMPEG_PATH
    tasks: [
      {
        app:  'live',
        hls:  true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
      },
    ],
  },
};

const nms = new NodeMediaServer(config);

module.exports = nms;
