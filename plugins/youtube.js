const { cmd, commands } = require('../command');
 
const { BufferJSON, Browsers, WA_DEFAULT_EPHEMERAL, makeWASocket, generateWAMessageFromContent, proto, getBinaryNodeChildren, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType, useMultiFileAuthState, fetchLatestBaileysVersion, downloadContentFromMessage} = require('@whiskeysockets/baileys');
const yts = require('yt-search');
const config = require('../config.js')
let prefix = config.PREFIX;
const axios = require("axios");

// Download YouTube video as MP3

async function ytmp3(url,base, apikey) {
  try {
    if (!url) {
      throw new Error("URL parameter is required");
    }
    if (!apikey) {
      throw new Error("API key is required");
    }

    // Call the API using axios
    const response = await axios.get(`${base}/api/ytmp3`, {
      params: {
        url: url,
        apikey: apikey,
      },
    });

    const data = response.data;

    if (!data || data.status !== true) {
      throw new Error(data.message || "Failed to fetch data from the API");
    }

    return {
      status: true,
      Created_by: "Janith Rashmika",
      dl_link: data.downloadLink,
    };
  } catch (error) {
    return { status: false, error: error.response?.data?.message || error.message };
  }
}


// Download YouTube video in specified format (e.g., MP4)


async function ytmp4(url,base, quality, apikey) {
  try {
    if (!url) {
      throw new Error("URL parameter is required");
    }
    if (!quality) {
      throw new Error("Quality parameter is required");
    }
    if (!apikey) {
      throw new Error("API key is required");
    }

    // Call the API using axios
    const response = await axios.get(`${base}/api/ytmp4`, {
      params: {
        url: url,
        quality: quality,
        apikey: apikey,
      },
    });

    const data = response.data;

    if (!data || data.status !== true) {
      throw new Error(data.message || "Failed to fetch data from the API");
    }

    return {
      status: true,
      Created_by: "Ansar Panhwar",
      quality: data.quality,
      dl_link: data.downloadLink,
    };
  } catch (error) {
    return { status: false, error: error.response?.data?.message || error.message };
  }
}


async function ytmp33(query,base, key) {
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
        attempts++;
        console.log(`Retrying... Attempt ${attempts}`);
        
        try {
            const data = await ytmp3(query,base, key);
            if (data && data.dl_link) {
                return data.dl_link; // Download URL Found
            }
        } catch (error) {
            console.error(`Attempt ${attempts} failed: ${error.message}`);
        }
    }

    throw new Error(`Failed to get download URL after ${maxAttempts} attempts.`);
}

async function ytmp44(url,base, quality, apikey) {
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
        attempts++;
        console.log(`Retrying... Attempt ${attempts}`);
        
        try {
            const data = await ytmp4(url,base, quality, apikey);
            if (data) {
                return data.dl_link; // Download URL Found
            }
        } catch (error) {
            console.error(`Attempt ${attempts} failed: ${error.message}`);
        }
    }

    throw new Error(`Failed to get download URL after ${maxAttempts} attempts.`);
}

// Function to extract the video ID from youtu.be or YouTube links
function extractYouTubeId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|playlist\?list=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Function to convert any YouTube URL to a full YouTube watch URL
function convertYouTubeLink(q) {
    const videoId = extractYouTubeId(q);
    if (videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
    }
    return q;
}

// .song command
cmd({
    pattern: "song",
    desc: "To download songs.",
    react: "🎵",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, quoted, apikey,baseurl, body, args, q, isGroup,pushname, reply }) => {
    if(config.BTN_MSG === true && !isGroup){
      try {
        if (!q) return reply("Please give me a URL or title.");
        q = convertYouTubeLink(q);
        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;
        // Fetch download URL
        const down = await ytmp33(`${url}`,baseurl,`${apikey}`);
        const downloadUrl = down;

        const captionHeader = `
    ⫷⦁[ * '-'_꩜ 𝙋𝘼𝙉𝙃𝙒𝘼𝙍 𝙈𝘿 𝙎𝙊𝙉𝙂 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿𝙀𝙍 ꩜_'-' * ]⦁⫸

🎵 *Song Found!* 

➥ *Title:* ${data.title} 
➥ *Duration:* ${data.timestamp} 
➥ *Views:* ${data.views} 
➥ *Uploaded On:* ${data.ago} 
➥ *Link:* ${data.url} 

🎧 *Enjoy the music brought to you by* *Queen Anju Bot*! 

> *Created with ❤️ by Janith Rashmika* 

> * ©Pᴏᴡᴇʀᴇᴅ Bʏ Aɴsᴀʀ-Pᴀɴʜᴡᴀʀ  
*💻 GitHub:* github.com/ANSAR-PANHWAR/PANHWAR-MD    
    `;
    
    let msg = generateWAMessageFromContent(
        m.chat,
        {
          viewOnceMessage: {
            message: {
              interactiveMessage: {
                body: {
                  text: `👉 𝐇𝐞𝐥𝐥𝐨 ${pushname} 𝐈'𝐦 𝐀𝐧𝐬𝐚𝐫-𝐏𝐚𝐧𝐡𝐰𝐚𝐫 💚\n\n🍂 𝐉𝐨𝐢𝐧 𝐌𝐲 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 -:\n\nhttps://whatsapp.com/channel/0029ValASu1IN9ifummBKW1Un\n> *⚖️𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 - : ©𝐀𝐍𝐒𝐀𝐑-𝐏𝐀𝐍𝐇𝐖𝐀𝐑. 💗*`
                },
                carouselMessage: {
                  cards: [
                    {
                      header: proto.Message.InteractiveMessage.Header.create({
                        ...(await prepareWAMessageMedia({ image: { url: data.thumbnail } }, { upload: conn.waUploadToServer })),
                        title: ``,
                        gifPlayback: true,
                        subtitle: `©𝐀𝐍𝐒𝐀𝐑-𝐏𝐀𝐍𝐇𝐖𝐀𝐑. 💗`,
                        hasMediaAttachment: false
                      }),
                      body: { text: `${captionHeader}`},
                      nativeFlowMessage: {
                        buttons: [
                        {
                        "name": "quick_reply",
                        "buttonParamsJson": `{\"display_text\":\"Audio 🎧\",\"id\":\"${prefix}yt1s ${url} & 1"}`
                        },
                        {
                        "name": "quick_reply",
                        "buttonParamsJson": `{\"display_text\":\"Document 🗂\",\"id\":\"${prefix}yt1s ${url} & 2"}`
                        },                                            
                        {
                        "name": "cta_url",
                        "buttonParamsJson": "{\"display_text\":\"𝐏𝐀𝐍𝐇𝐖𝐀𝐑-𝐌𝐃 💚\",\"url\":\"https://whatsapp.com/channel/0029ValASu1IN9ifummBKW1U\",\"merchant_url\":\"https://www.google.com\"}"
                        },
                        ],
                      },
                    }
                  ],
                             messageVersion: 1,
                             },
                             contextInfo: {
                             mentionedJid: [m.sender],
                             forwardingScore: 999,
                             isForwarded: true,
                             forwardedNewsletterMessageInfo: {
                             newsletterJid: '120363299978149557@newsletter',
                             newsletterName: `𝐀𝐍𝐒𝐀𝐑-𝐏𝐀𝐍𝐇𝐖𝐀𝐑. 💗`,
                             serverMessageId: 143
                                }
                            }
                        }
                    }
                },
            },
            { quoted: mek })
            
                await conn.relayMessage(msg.key.remoteJid, msg.message, {
          messageId: msg.key.id,
        });
        
    } catch (e) {
        console.error(e);
        reply(`${e}`);
    }
  } else {
    try {
            if (!q) return reply("Please give me a URL or title.");
            q = convertYouTubeLink(q);
            const search = await yts(q);
            const data = search.videos[0];
            const url = data.url;
    
            let desc = `
    ⫷⦁[ * '-'_꩜ 𝙋𝘼𝙉𝙃𝙒𝘼𝙍 𝙈𝘿 𝙎𝙊𝙉𝙂 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿𝙀𝙍 ꩜_'-' * ]⦁⫸
    
    🎵 *Song Found!* 
    
    ➥ *Title:* ${data.title} 
    ➥ *Duration:* ${data.timestamp} 
    ➥ *Views:* ${data.views} 
    ➥ *Uploaded On:* ${data.ago} 
    ➥ *Link:* ${data.url} 
    
    🎧 *Enjoy the music brought to you by* *Panhwar MD Bot*! 
    
    🔽 *To download send:*
    
    1. *Audio File* 🎶
    2. *Document File* 📂
    
    > *Created with ❤️ by Ansar Panhwar* 
    
    > * ©ᴀɴsᴀʀ ᴘᴀɴʜᴡᴀʀ 💚   
    *💻 GitHub:* github.com/ANSAR-PANHWAR/PANHWAR-MD    
    `;
    let info = `
    🎥 *MP3 Download Found!* 
    
    ➥ *Title:* ${data.title} 
    ➥ *Duration:* ${data.timestamp} 
    ➥ *Views:* ${data.views} 
    ➥ *Uploaded On:* ${data.ago} 
    ➥ *Link:* ${data.url} 
    
    🎬 *Enjoy the video brought to you by Queen Anju Bot!* 
    `
    
    
            // Send the initial message and store the message ID
            const sentMsg = await conn.sendMessage(from, {
                image: { url: data.thumbnail}, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
                caption: desc,
                contextInfo: {
                    mentionedJid: ['923702587522@s.whatsapp.net'], // specify mentioned JID(s) if any
                    groupMentions: [],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363321103874131@newsletter',
                        newsletterName: "©Aɴsᴀʀ-Pᴀɴʜᴡᴀʀ 💚",
                        serverMessageId: 999
                    },
                    externalAdReply: {
                        title: '©𝐏𝐚𝐧𝐡𝐰𝐚𝐫 💚',
                        body: ' ©𝐏𝐚𝐧𝐡𝐰𝐚𝐫 💚',
                        mediaType: 1,
                        sourceUrl: "https://github.com/ANSAR-PANHWAR",
                        thumbnailUrl: 'https://qu.ax/VlRBp.jpg', // This should match the image URL provided above
                        renderLargerThumbnail: false,
                        showAdAttribution: true
                    }
                }
              });
    
            // Add a reply tracker for the sent message
            conn.addReplyTracker(sentMsg.key.id, async (replyMek, messageType) => {
                const choice = messageType.trim();
            
                if (choice === '1' || choice === '2') {
                    // React to the user's reply (⬇️: download starting)
                    await conn.sendMessage(from, {
                        react: { text: '⬇️', key: replyMek.key }
                    });
            
                    try {
                        // Fetch download URL
                        const down = await ytmp33(`${url}`,baseurl,`${apikey}`);
                        const downloadUrl = down;
            
                        // React to the upload starting (⬆️)
                        await conn.sendMessage(from, {
                            react: { text: '⬆️', key: replyMek.key }
                        });
            
                        if (choice === '1') {
                            // Handle option 1 (Audio File)
                            await conn.sendMessage(from, {
                                audio: { url: downloadUrl },
                                mimetype: "audio/mpeg",
                                contextInfo: {
                                    externalAdReply: {
                                        title: data.title,
                                        body: data.videoId,
                                        mediaType: 1,
                                        sourceUrl: data.url,
                                        thumbnailUrl: data.thumbnail, // Ensure this URL is correct
                                        renderLargerThumbnail: true,
                                        showAdAttribution: true
                                    }
                                }
                            }, { quoted: replyMek });
                        } else if (choice === '2') {
                            // Handle option 2 (Document File)
                            await conn.sendMessage(from, {
                                document: { url: downloadUrl },
                                mimetype: "audio/mp3",
                                fileName: `${data.title}.mp3`,
                                caption: info,
                                contextInfo: {
                                    mentionedJid: ['94717775628@s.whatsapp.net'],
                                    externalAdReply: {
                                        title: '© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚',
                                        body: ' ©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂 💚',
                                        mediaType: 1,
                                        sourceUrl: "https://github.com/Mrrashmika",
                                        thumbnailUrl: 'https://raw.githubusercontent.com/RASH-DATA/ANJU-DATA/refs/heads/main/LOGOS/thisjpg.jpg',
                                        renderLargerThumbnail: false,
                                        showAdAttribution: true
                                    }
                                }
                            }, { quoted: replyMek });
                        }
            
                        // React to the successful completion of the task (✅)
                        await conn.sendMessage(from, {
                            react: { text: '✅', key: replyMek.key }
                        });
            
                    } catch (error) {
                        // Handle any errors during the process
                        console.error("Error during file processing:", error);
                        await conn.sendMessage(from, { text: "An error occurred while processing your request. Please try again." }, { quoted: replyMek });
                    }
                } else {
                    // React to invalid input
                    await conn.sendMessage(from, {
                        react: { text: '❌', key: replyMek.key }
                    });
                    await conn.sendMessage(from, { text: "Invalid option. Please reply with 1 or 2." }, { quoted: replyMek });
                }
            });
            
        } catch (e) {
            console.error(e);
            reply(`${e}`);
        }
  }
});

cmd({
    pattern: "yt1s",
    desc: "To download songs.",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, quoted, apikey,baseurl, body, args, q, reply }) => {
    try {
        if (!q) return;
        const Download = q.split(' & ')[0];
        const choice = q.split(' & ')[1];
        const search = await yts(Download);
        const data = search.videos[0];
        const url = data.url;
        // Fetch download URL
        m.react('⬇️')
        const down = await ytmp33(`${url}`,baseurl,`${apikey}`);
        const downloadUrl = down;
        

let info = `
🎥 *MP3 Download Found!* 

➥ *Title:* ${data.title} 
➥ *Duration:* ${data.timestamp} 
➥ *Views:* ${data.views} 
➥ *Uploaded On:* ${data.ago} 
➥ *Link:* ${data.url} 

🎬 *Enjoy the video brought to you by Queen Anju Bot!* 
`
        
            // React to the upload starting (⬆️)
                    m.react('⬆️')
        
                    if (choice === '1') {
                        // Handle option 1 (Audio File)
                        await conn.sendMessage(from, {
                            audio: { url: downloadUrl },
                            mimetype: "audio/mpeg",
                            contextInfo: {
                                externalAdReply: {
                                    title: data.title,
                                    body: data.videoId,
                                    mediaType: 1,
                                    sourceUrl: data.url,
                                    thumbnailUrl: data.thumbnail, // Ensure this URL is correct
                                    renderLargerThumbnail: true,
                                    showAdAttribution: true
                                }
                            }
                        }, { quoted: mek });
                    } else if (choice === '2') {
                        // Handle option 2 (Document File)
                        await conn.sendMessage(from, {
                            document: { url: downloadUrl },
                            mimetype: "audio/mp3",
                            fileName: `${data.title}.mp3`,
                            caption: info,
                            contextInfo: {
                                mentionedJid: ['94717775628@s.whatsapp.net'],
                                externalAdReply: {
                                    title: '© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚',
                                    body: ' ©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂 💚',
                                    mediaType: 1,
                                    sourceUrl: "https://github.com/Mrrashmika",
                                    thumbnailUrl: 'https://raw.githubusercontent.com/RASH-DATA/ANJU-DATA/refs/heads/main/LOGOS/thisjpg.jpg',
                                    renderLargerThumbnail: false,
                                    showAdAttribution: true
                                }
                            }
                        }, { quoted: mek });
                    }
        
                    // React to the successful completion of the task (✅)
                    m.react('✅')
                }catch(e){
                    console.log(e)
                    reply(`${e}`)
                }
            });

cmd({
    pattern: "yts",
    desc: "To search for videos on YouTube.",
    react: "🎥",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if(config.BTN_MSG === true && !isGroup){
      try {
        if (!q) return reply("Please provide a search query.");
        
        const search = await yts(q);
        const data = search.videos.slice(0, 5); // Get top 5 search results

let msg = generateWAMessageFromContent(
    m.chat,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: `👉 𝐇𝐞𝐥𝐥𝐨 ${pushname} 𝐈'𝐦 © 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚\n\n🍂 𝐉𝐨𝐢𝐧 𝐌𝐲 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 -:\n\nhttps://whatsapp.com/channel/0029Vaj5XmgFXUubAjlU5642\n\n> *⚖️𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 - : ©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂. 💗*`
            },
            carouselMessage: {
              cards: [
                {
                  header: proto.Message.InteractiveMessage.Header.create({
                    ...(await prepareWAMessageMedia({ image: { url: data[0].thumbnail } }, { upload: conn.waUploadToServer })),
                    title: ``,
                    gifPlayback: true,
                    subtitle: `©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂. 💗`,
                    hasMediaAttachment: false
                  }),
                  body: { text:  `⫷⦁[ * '-'_꩜ 𝙌𝙐𝙀𝙀𝙉 𝘼𝙉𝙅𝙐 𝙔𝙏𝙎 𝙎𝙀𝘼𝙍𝘾𝙃 ꩜_'-' * ]⦁⫸\n\n🔍 *Search Results for:* ${q}\n\n➥ *Title:* ${data[0].title}\n ➥ *Duration:* ${data[0].timestamp}\n ➥ *Views:* ${data[0].views}\n➥ *Uploaded On:* ${data[0].ago}\n➥ *Link:* ${data[0].url}\n\n> *Created with ❤️ by Janith Rashmika*\n> * © 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚\n*💻 GitHub:* github.com/Mrrashmika/QUEEN_ANJU_MD\n`},
                  nativeFlowMessage: {
                    buttons: [
                    {
                    "name": "quick_reply",
                    "buttonParamsJson": `{\"display_text\":\"Song 🎧\",\"id\":\"${prefix}song ${data[0].url} & 1"}`
                    },
                    {
                    "name": "quick_reply",
                    "buttonParamsJson": `{\"display_text\":\"*Video* 🎶\",\"id\":\"${prefix}video ${data[0].url} & 2"}`
                    },                                            
                    {
                    "name": "cta_url",
                    "buttonParamsJson": "{\"display_text\":\"𝐀𝐍𝐉𝐔 𝐌𝐃 V3 💚\",\"url\":\"https://whatsapp.com/channel/0029VaN1XMn2ZjCsu9eZQP3R\",\"merchant_url\":\"https://www.google.com\"}"
                    },
                    ],
                  },
                },
                {
                    header: proto.Message.InteractiveMessage.Header.create({
                      ...(await prepareWAMessageMedia({ image: { url: data[1].thumbnail } }, { upload: conn.waUploadToServer })),
                      title: ``,
                      gifPlayback: true,
                      subtitle: `©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂. 💗`,
                      hasMediaAttachment: false
                    }),
                    body: { text:  `⫷⦁[ * '-'_꩜ 𝙌𝙐𝙀𝙀𝙉 𝘼𝙉𝙅𝙐 𝙔𝙏𝙎 𝙎𝙀𝘼𝙍𝘾𝙃 ꩜_'-' * ]⦁⫸\n\n🔍 *Search Results for:* ${q}\n\n➥ *Title:* ${data[1].title}\n ➥ *Duration:* ${data[1].timestamp}\n ➥ *Views:* ${data[1].views}\n➥ *Uploaded On:* ${data[1].ago}\n➥ *Link:* ${data[1].url}\n\n> *Created with ❤️ by Janith Rashmika*\n> * © 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚\n*💻 GitHub:* github.com/Mrrashmika/QUEEN_ANJU_MD\n`},
                    nativeFlowMessage: {
                      buttons: [
                      {
                      "name": "quick_reply",
                      "buttonParamsJson": `{\"display_text\":\"Song 🎧\",\"id\":\"${prefix}song ${data[1].url} & 1"}`
                      },
                      {
                      "name": "quick_reply",
                      "buttonParamsJson": `{\"display_text\":\"*Video* 🎶\",\"id\":\"${prefix}video ${data[1].url} & 2"}`
                      },                                            
                      {
                      "name": "cta_url",
                      "buttonParamsJson": "{\"display_text\":\"𝐀𝐍𝐉𝐔 𝐌𝐃 V3 💚\",\"url\":\"https://whatsapp.com/channel/0029VaN1XMn2ZjCsu9eZQP3R\",\"merchant_url\":\"https://www.google.com\"}"
                      },
                      ],
                    },
                  },
                  {
                    header: proto.Message.InteractiveMessage.Header.create({
                      ...(await prepareWAMessageMedia({ image: { url: data[2].thumbnail } }, { upload: conn.waUploadToServer })),
                      title: ``,
                      gifPlayback: true,
                      subtitle: `©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂. 💗`,
                      hasMediaAttachment: false
                    }),
                    body: { text:  `⫷⦁[ * '-'_꩜ 𝙌𝙐𝙀𝙀𝙉 𝘼𝙉𝙅𝙐 𝙔𝙏𝙎 𝙎𝙀𝘼𝙍𝘾𝙃 ꩜_'-' * ]⦁⫸\n\n🔍 *Search Results for:* ${q}\n\n➥ *Title:* ${data[2].title}\n ➥ *Duration:* ${data[2].timestamp}\n ➥ *Views:* ${data[2].views}\n➥ *Uploaded On:* ${data[2].ago}\n➥ *Link:* ${data[2].url}\n\n> *Created with ❤️ by Janith Rashmika*\n> * © 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚\n*💻 GitHub:* github.com/Mrrashmika/QUEEN_ANJU_MD\n`},
                    nativeFlowMessage: {
                      buttons: [
                      {
                      "name": "quick_reply",
                      "buttonParamsJson": `{\"display_text\":\"Song 🎧\",\"id\":\"${prefix}song ${data[2].url} & 1"}`
                      },
                      {
                      "name": "quick_reply",
                      "buttonParamsJson": `{\"display_text\":\"*Video* 🎶\",\"id\":\"${prefix}video ${data[2].url} & 2"}`
                      },                                            
                      {
                      "name": "cta_url",
                      "buttonParamsJson": "{\"display_text\":\"𝐀𝐍𝐉𝐔 𝐌𝐃 V3 💚\",\"url\":\"https://whatsapp.com/channel/0029VaN1XMn2ZjCsu9eZQP3R\",\"merchant_url\":\"https://www.google.com\"}"
                      },
                      ],
                    },
                  },
                  {
                    header: proto.Message.InteractiveMessage.Header.create({
                      ...(await prepareWAMessageMedia({ image: { url: data[3].thumbnail } }, { upload: conn.waUploadToServer })),
                      title: ``,
                      gifPlayback: true,
                      subtitle: `©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂. 💗`,
                      hasMediaAttachment: false
                    }),
                    body: { text:  `⫷⦁[ * '-'_꩜ 𝙌𝙐𝙀𝙀𝙉 𝘼𝙉𝙅𝙐 𝙔𝙏𝙎 𝙎𝙀𝘼𝙍𝘾𝙃 ꩜_'-' * ]⦁⫸\n\n🔍 *Search Results for:* ${q}\n\n➥ *Title:* ${data[3].title}\n ➥ *Duration:* ${data[3].timestamp}\n ➥ *Views:* ${data[3].views}\n➥ *Uploaded On:* ${data[3].ago}\n➥ *Link:* ${data[3].url}\n\n> *Created with ❤️ by Janith Rashmika*\n> * © 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚\n*💻 GitHub:* github.com/Mrrashmika/QUEEN_ANJU_MD\n`},
                    nativeFlowMessage: {
                      buttons: [
                      {
                      "name": "quick_reply",
                      "buttonParamsJson": `{\"display_text\":\"Song 🎧\",\"id\":\"${prefix}song ${data[3].url} & 1"}`
                      },
                      {
                      "name": "quick_reply",
                      "buttonParamsJson": `{\"display_text\":\"*Video* 🎶\",\"id\":\"${prefix}video ${data[3].url} & 2"}`
                      },                                            
                      {
                      "name": "cta_url",
                      "buttonParamsJson": "{\"display_text\":\"𝐀𝐍𝐉𝐔 𝐌𝐃 V3 💚\",\"url\":\"https://whatsapp.com/channel/0029VaN1XMn2ZjCsu9eZQP3R\",\"merchant_url\":\"https://www.google.com\"}"
                      },
                      ],
                    },
                  },
                  {
                    header: proto.Message.InteractiveMessage.Header.create({
                      ...(await prepareWAMessageMedia({ image: { url: data[4].thumbnail } }, { upload: conn.waUploadToServer })),
                      title: ``,
                      gifPlayback: true,
                      subtitle: `©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂. 💗`,
                      hasMediaAttachment: false
                    }),
                    body: { text:  `⫷⦁[ * '-'_꩜ 𝙌𝙐𝙀𝙀𝙉 𝘼𝙉𝙅𝙐 𝙔𝙏𝙎 𝙎𝙀𝘼𝙍𝘾𝙃 ꩜_'-' * ]⦁⫸\n\n🔍 *Search Results for:* ${q}\n\n➥ *Title:* ${data[4].title}\n ➥ *Duration:* ${data[4].timestamp}\n ➥ *Views:* ${data[4].views}\n➥ *Uploaded On:* ${data[4].ago}\n➥ *Link:* ${data[4].url}\n\n> *Created with ❤️ by Janith Rashmika*\n> * © 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚\n*💻 GitHub:* github.com/Mrrashmika/QUEEN_ANJU_MD\n`},
                    nativeFlowMessage: {
                      buttons: [
                      {
                      "name": "quick_reply",
                      "buttonParamsJson": `{\"display_text\":\"Song 🎧\",\"id\":\"${prefix}song ${data[4].url} & 1"}`
                      },
                      {
                      "name": "quick_reply",
                      "buttonParamsJson": `{\"display_text\":\"*Video* 🎶\",\"id\":\"${prefix}video ${data[4].url} & 2"}`
                      },                                            
                      {
                      "name": "cta_url",
                      "buttonParamsJson": "{\"display_text\":\"𝐀𝐍𝐉𝐔 𝐌𝐃 V3 💚\",\"url\":\"https://whatsapp.com/channel/0029VaN1XMn2ZjCsu9eZQP3R\",\"merchant_url\":\"https://www.google.com\"}"
                      },
                      ],
                    },
                  }
              ],
                         messageVersion: 1,
                         },
                         contextInfo: {
                         mentionedJid: [m.sender],
                         forwardingScore: 999,
                         isForwarded: true,
                         forwardedNewsletterMessageInfo: {
                         newsletterJid: '120363299978149557@newsletter',
                         newsletterName: `𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂. 💗`,
                         serverMessageId: 143
                            }
                        }
                    }
                }
            },
        },
        { quoted: mek })
        
            await conn.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id,
    });
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
  } else {
    try {
            if (!q) return reply("Please provide a search query.");
            
            const search = await yts(q);
            const results = search.videos.slice(0, 10); // Get top 10 search results
    
            let desc = `
    ⫷⦁[ * '-'_꩜ 𝙌𝙐𝙀𝙀𝙉 𝘼𝙉𝙅𝙐 𝙔𝙏𝙎 𝙎𝙀𝘼𝙍𝘾𝙃 ꩜_'-' * ]⦁⫸
    
    🔍 *Search Results for:* ${q}
    
    `;
    
            results.forEach((video, index) => {
                desc += `
    ${index + 1}. *Title:* ${video.title} 
       *Duration:* ${video.timestamp} 
       *Views:* ${video.views} 
       *Uploaded On:* ${video.ago} 
       *Link:* ${video.url}
    `;
            });
    
            desc += `
    > *Created with ❤️ by Janith Rashmika* 
    > * © 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚  
    *💻 GitHub:* github.com/Mrrashmika/QUEEN_ANJU_MD
    `;
    
    await conn.sendMessage(from, {
        image: { url: search.videos[0].thumbnail}, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
        caption: desc,
        contextInfo: {
            mentionedJid: ['94717775628@s.whatsapp.net'], // specify mentioned JID(s) if any
            groupMentions: [],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363299978149557@newsletter',
                newsletterName: "© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚",
                serverMessageId: 999
            },
            externalAdReply: {
                title: '© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚',
                body: ' ©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂 💚',
                mediaType: 1,
                sourceUrl: "https://github.com/Mrrashmika",
                thumbnailUrl: 'https://raw.githubusercontent.com/RASH-DATA/ANJU-DATA/refs/heads/main/LOGOS/thisjpg.jpg', // This should match the image URL provided above
                renderLargerThumbnail: false,
                showAdAttribution: true
            }
        }
      });
    
        } catch (e) {
            console.log(e);
            reply(`${e}`);
        }
  }
});

cmd({
    pattern: "video",
    desc: "To download videos.",
    react: "🎥",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup,apikey,baseurl, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if(config.BTN_MSG === true && !isGroup){
    try {
        if (!q) return reply("Please give me a URL or title.");

        q = convertYouTubeLink(q);
        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        let desc = `
⫷⦁[ * '-'_꩜ 𝙌𝙐𝙀𝙀𝙉 𝘼𝙉𝙅𝙐 𝙑𝙄𝘿𝙀𝙊 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿𝙀𝙍 ꩜_'-' * ]⦁⫸ 

🎥 *Video Found!* 

➥ *Title:* ${data.title} 
➥ *Duration:* ${data.timestamp} 
➥ *Views:* ${data.views} 
➥ *Uploaded On:* ${data.ago} 
➥ *Link:* ${data.url} 

🎬 *Enjoy the video brought to you by* *Queen Anju Bot*! 

> *Created with ❤️ by Janith Rashmika* 

> *© 𝙌𝙐𝙀𝙀𝙉 𝘼𝙉𝙅𝙐 𝘽𝙊𝙏 - MD*  
*💻 GitHub:* github.com/Mrrashmika/QUEEN_ANJU_MD
`;
let info = `
🎥 *MP4 Download Found!* 

➥ *Title:* ${data.title} 
➥ *Duration:* ${data.timestamp} 
➥ *Views:* ${data.views} 
➥ *Uploaded On:* ${data.ago} 
➥ *Link:* ${data.url} 

🎬 *Enjoy the video brought to you by Queen Anju Bot!* 
`
let msg = generateWAMessageFromContent(
    m.chat,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: `👉 𝐇𝐞𝐥𝐥𝐨 ${pushname} 𝐈'𝐦 © 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚\n\n🍂 𝐉𝐨𝐢𝐧 𝐌𝐲 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 -:\n\nhttps://whatsapp.com/channel/0029Vaj5XmgFXUubAjlU5642\n\n> *⚖️𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 - : ©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂. 💗*`
            },
            carouselMessage: {
              cards: [
                {
                  header: proto.Message.InteractiveMessage.Header.create({
                    ...(await prepareWAMessageMedia({ image: { url: data.thumbnail } }, { upload: conn.waUploadToServer })),
                    title: ``,
                    gifPlayback: true,
                    subtitle: `©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂. 💗`,
                    hasMediaAttachment: false
                  }),
                  body: { text: `${desc}`},
                  nativeFlowMessage: {
                    buttons: [
                        {
                            "name": "single_select",
                            "buttonParamsJson": 
            `{"title":"*Video File* 🎶",
            "sections":[{"title":"𝐑𝐀𝐒𝐇 𝐃𝐄𝐕𝐒💗",
            "rows":[{
            "header": "1.1",
            "title": "*360*",
            "description": "360p VIDEO",
            "id": "${prefix}yt2s ${url} & 360"
            },
            {
            "header": "1.2",
            "title": "*480*",
            "description": "480p VIDEO",
            "id": "${prefix}yt2s ${url} & 480"
            },
            {
            "header": "1.3",
            "title": "*720*",
            "description": "720p VIDEO",
            "id": "${prefix}yt2s ${url} & 720"
            },
            {
            "header": "1.4",
            "title": "*1080*",
            "description": "1080p VIDEO",
            "id": "${prefix}yt2s ${url} & 1080"
            }
            ]
            }]
            }`
                      },
                      {
                        "name": "single_select",
                        "buttonParamsJson": 
        `{"title":"*Document File* 📂",
        "sections":[{"title":"𝐑𝐀𝐒𝐇 𝐃𝐄𝐕𝐒💗",
        "rows":[{
        "header": "2.1",
        "title": "*360*",
        "description": "360p DOCUMENT",
        "id": "${prefix}yt3s ${url} & 360"
        },
        {
        "header": "2.2",
        "title": "*480*",
        "description": "480p DOCUMENT",
        "id": "${prefix}yt3s ${url} & 480"
        },
        {
        "header": "2.3",
        "title": "*720*",
        "description": "720p DOCUMENT",
        "id": "${prefix}yt3s ${url} & 720"
        },
        {
        "header": "2.4",
        "title": "*1080*",
        "description": "1080p DOCUMENT",
        "id": "${prefix}yt3s ${url} & 1080"
        }
        ]
        }]
        }`
                  },                                            
                    {
                    "name": "cta_url",
                    "buttonParamsJson": "{\"display_text\":\"𝐀𝐍𝐉𝐔 𝐌𝐃 V3 💚\",\"url\":\"https://whatsapp.com/channel/0029VaN1XMn2ZjCsu9eZQP3R\",\"merchant_url\":\"https://www.google.com\"}"
                    },
                    ],
                  },
                }
              ],
                         messageVersion: 1,
                         },
                         contextInfo: {
                         mentionedJid: [m.sender],
                         forwardingScore: 999,
                         isForwarded: true,
                         forwardedNewsletterMessageInfo: {
                         newsletterJid: '120363299978149557@newsletter',
                         newsletterName: `𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂. 💗`,
                         serverMessageId: 143
                            }
                        }
                    }
                }
            },
        },
        { quoted: mek })
        
            await conn.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id,
    });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
  } else {
    try {
            if (!q) return reply("Please give me a URL or title.");
    
            q = convertYouTubeLink(q);
            const search = await yts(q);
            const data = search.videos[0];
            const url = data.url;
    
            let desc = `
    ⫷⦁[ * '-'_꩜ 𝙌𝙐𝙀𝙀𝙉 𝘼𝙉𝙅𝙐 𝙑𝙄𝘿𝙀𝙊 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿𝙀𝙍 ꩜_'-' * ]⦁⫸ 
    
    🎥 *Video Found!* 
    
    ➥ *Title:* ${data.title} 
    ➥ *Duration:* ${data.timestamp} 
    ➥ *Views:* ${data.views} 
    ➥ *Uploaded On:* ${data.ago} 
    ➥ *Link:* ${data.url} 
    
    🎬 *Enjoy the video brought to you by* *Queen Anju Bot*! 
    
    🔽 *To download send:*
    
     *Video File* 🎶
       1.1 *360*
       1.2 *480*
       1.3 *720*
       1.4 *1080*
     *Document File* 📂
       2.1 *360*
       2.2 *480*
       2.3 *720*
       2.4 *1080*
    
    > *Created with ❤️ by Janith Rashmika* 
    
    > *© 𝙌𝙐𝙀𝙀𝙉 𝘼𝙉𝙅𝙐 𝘽𝙊𝙏 - MD*  
    *💻 GitHub:* github.com/Mrrashmika/QUEEN_ANJU_MD
    `;
    let info = `
    🎥 *MP4 Download Found!* 
    
    ➥ *Title:* ${data.title} 
    ➥ *Duration:* ${data.timestamp} 
    ➥ *Views:* ${data.views} 
    ➥ *Uploaded On:* ${data.ago} 
    ➥ *Link:* ${data.url} 
    
    🎬 *Enjoy the video brought to you by Queen Anju Bot!* 
    `
    
    
            // Send the initial message and store the message ID
            const sentMsg = await conn.sendMessage(from, {
                image: { url: data.thumbnail}, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
                caption: desc,
                contextInfo: {
                    mentionedJid: ['94717775628@s.whatsapp.net'], // specify mentioned JID(s) if any
                    groupMentions: [],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363299978149557@newsletter',
                        newsletterName: "© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚",
                        serverMessageId: 999
                    },
                    externalAdReply: {
                        title: '© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚',
                        body: ' ©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂 💚',
                        mediaType: 1,
                        sourceUrl: "https://github.com/Mrrashmika",
                        thumbnailUrl: 'https://raw.githubusercontent.com/RASH-DATA/ANJU-DATA/refs/heads/main/LOGOS/thisjpg.jpg', // This should match the image URL provided above
                        renderLargerThumbnail: false,
                        showAdAttribution: true
                    }
                }
              });
                    const messageID = sentMsg.key.id; // Save the message ID for later reference
    
    
            // Listen for the user's response
            conn.addReplyTracker(messageID, async (mek, messageType) => {
                if (!mek.message) return;
                const from = mek.key.remoteJid;
                const sender = mek.key.participant || mek.key.remoteJid;
    
                // React to the user's reply (the "1" or "2" message)
                await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
    
                    if (messageType === '1.1') {
                        const down = await ytmp44(`${url}`,baseurl,"360p",`${apikey}`)                     
                        const downloadUrl = down;
                        // React to the upload (sending the file)
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        // Handle option 1 (Audio File)
                        await conn.sendMessage(from, {
                    video: { url: downloadUrl}, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
                    caption: info,
                    contextInfo: {
                        mentionedJid: ['94717775628@s.whatsapp.net'], // specify mentioned JID(s) if any
                        groupMentions: [],
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363299978149557@newsletter',
                            newsletterName: "© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚",
                            serverMessageId: 999
                        },
                        externalAdReply: {
                            title: '© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚',
                            body: ' ©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂 💚',
                            mediaType: 1,
                            sourceUrl: "https://github.com/Mrrashmika",
                            thumbnailUrl: 'https://raw.githubusercontent.com/RASH-DATA/ANJU-DATA/refs/heads/main/LOGOS/thisjpg.jpg', // This should match the image URL provided above
                            renderLargerThumbnail: false,
                            showAdAttribution: true
                        }
                    }
                  });
                    }else if (messageType === '1.2') {
                        const down = await ytmp44(`${url}`,baseurl,`480`,`${apikey}`)                     
                        const downloadUrl = down;
                        // React to the upload (sending the file)
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        // Handle option 1 (Audio File)
                        await conn.sendMessage(from, {
                    video: { url: downloadUrl}, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
                    caption: info,
                    contextInfo: {
                        mentionedJid: ['94717775628@s.whatsapp.net'], // specify mentioned JID(s) if any
                        groupMentions: [],
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363299978149557@newsletter',
                            newsletterName: "© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚",
                            serverMessageId: 999
                        },
                        externalAdReply: {
                            title: '© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚',
                            body: ' ©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂 💚',
                            mediaType: 1,
                            sourceUrl: "https://github.com/Mrrashmika",
                            thumbnailUrl: 'https://raw.githubusercontent.com/RASH-DATA/ANJU-DATA/refs/heads/main/LOGOS/thisjpg.jpg', // This should match the image URL provided above
                            renderLargerThumbnail: false,
                            showAdAttribution: true
                        }
                    }
                  });
                    }else if (messageType === '1.3') {
                        const down = await ytmp44(`${url}`,baseurl,`720`,`${apikey}`)                     
                        const downloadUrl = down;
                        // React to the upload (sending the file)
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        // Handle option 1 (Audio File)
                        await conn.sendMessage(from, {
                    video: { url: downloadUrl}, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
                    caption: info,
                    contextInfo: {
                        mentionedJid: ['94717775628@s.whatsapp.net'], // specify mentioned JID(s) if any
                        groupMentions: [],
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363299978149557@newsletter',
                            newsletterName: "© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚",
                            serverMessageId: 999
                        },
                        externalAdReply: {
                            title: '© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚',
                            body: ' ©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂 💚',
                            mediaType: 1,
                            sourceUrl: "https://github.com/Mrrashmika",
                            thumbnailUrl: 'https://raw.githubusercontent.com/RASH-DATA/ANJU-DATA/refs/heads/main/LOGOS/thisjpg.jpg', // This should match the image URL provided above
                            renderLargerThumbnail: false,
                            showAdAttribution: true
                        }
                    }
                  });
                    }else if (messageType === '1.4') {
                        const down = await ytmp44(`${url}`,baseurl,`1080`,`${apikey}`)                     
                        const downloadUrl = down;
                        // React to the upload (sending the file)
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        // Handle option 1 (Audio File)
                        await conn.sendMessage(from, {
                    video: { url: downloadUrl}, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
                    caption: info,
                    contextInfo: {
                        mentionedJid: ['94717775628@s.whatsapp.net'], // specify mentioned JID(s) if any
                        groupMentions: [],
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363299978149557@newsletter',
                            newsletterName: "© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚",
                            serverMessageId: 999
                        },
                        externalAdReply: {
                            title: '© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚',
                            body: ' ©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂 💚',
                            mediaType: 1,
                            sourceUrl: "https://github.com/Mrrashmika",
                            thumbnailUrl: 'https://raw.githubusercontent.com/RASH-DATA/ANJU-DATA/refs/heads/main/LOGOS/thisjpg.jpg', // This should match the image URL provided above
                            renderLargerThumbnail: false,
                            showAdAttribution: true
                        }
                    }
                  });
                    }else if (messageType === '2.1') {
                        const down = await ytmp44(`${url}`,baseurl,`360`,`${apikey}`)                     
                        const downloadUrl = down;
                        // React to the upload (sending the file)
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        // Handle option 1 (Audio File)
                        // Handle option 2 (Document File)
                        await conn.sendMessage(from, {
                            document: { url: downloadUrl},
                            mimetype: "video/mp4",
                            fileName: `${data.title}.mp4`, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
                            caption: info,
                            contextInfo: {
                                mentionedJid: ['94717775628@s.whatsapp.net'], // specify mentioned JID(s) if any
                                groupMentions: [],
                                forwardingScore: 999,
                                isForwarded: true,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: '120363299978149557@newsletter',
                                    newsletterName: "© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚",
                                    serverMessageId: 999
                                },
                                externalAdReply: {
                                    title: '© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚',
                                    body: ' ©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂 💚',
                                    mediaType: 1,
                                    sourceUrl: "https://github.com/Mrrashmika",
                                    thumbnailUrl: 'https://raw.githubusercontent.com/RASH-DATA/ANJU-DATA/refs/heads/main/LOGOS/thisjpg.jpg', // This should match the image URL provided above
                                    renderLargerThumbnail: false,
                                    showAdAttribution: true
                                }
                            }
                          });
                    }else if (messageType === '2.2') {
                        const down = await ytmp44(`${url}`,baseurl,`480`,`${apikey}`)                     
                        const downloadUrl = down;
                        // React to the upload (sending the file)
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        // Handle option 1 (Audio File)
                        // Handle option 2 (Document File)
                        await conn.sendMessage(from, {
                            document: { url: downloadUrl},
                            mimetype: "video/mp4",
                            fileName: `${data.title}.mp4`, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
                            caption: info,
                            contextInfo: {
                                mentionedJid: ['94717775628@s.whatsapp.net'], // specify mentioned JID(s) if any
                                groupMentions: [],
                                forwardingScore: 999,
                                isForwarded: true,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: '120363299978149557@newsletter',
                                    newsletterName: "© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚",
                                    serverMessageId: 999
                                },
                                externalAdReply: {
                                    title: '© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚',
                                    body: ' ©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂 💚',
                                    mediaType: 1,
                                    sourceUrl: "https://github.com/Mrrashmika",
                                    thumbnailUrl: 'https://raw.githubusercontent.com/RASH-DATA/ANJU-DATA/refs/heads/main/LOGOS/thisjpg.jpg', // This should match the image URL provided above
                                    renderLargerThumbnail: false,
                                    showAdAttribution: true
                                }
                            }
                          });
                    }else if (messageType === '2.3') {
                        const down = await ytmp44(`${url}`,baseurl,`720`,`${apikey}`)                     
                        const downloadUrl = down;
                        // React to the upload (sending the file)
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        // Handle option 1 (Audio File)
                        // Handle option 2 (Document File)
                        await conn.sendMessage(from, {
                            document: { url: downloadUrl},
                            mimetype: "video/mp4",
                            fileName: `${data.title}.mp4`, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
                            caption: info,
                            contextInfo: {
                                mentionedJid: ['94717775628@s.whatsapp.net'], // specify mentioned JID(s) if any
                                groupMentions: [],
                                forwardingScore: 999,
                                isForwarded: true,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: '120363299978149557@newsletter',
                                    newsletterName: "© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚",
                                    serverMessageId: 999
                                },
                                externalAdReply: {
                                    title: '© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚',
                                    body: ' ©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂 💚',
                                    mediaType: 1,
                                    sourceUrl: "https://github.com/Mrrashmika",
                                    thumbnailUrl: 'https://raw.githubusercontent.com/RASH-DATA/ANJU-DATA/refs/heads/main/LOGOS/thisjpg.jpg', // This should match the image URL provided above
                                    renderLargerThumbnail: false,
                                    showAdAttribution: true
                                }
                            }
                          });
                    }else if (messageType === '2.4') {
                        const down = await ytmp44(`${url}`,baseurl,`1080`,`${apikey}`)                     
                        const downloadUrl = down;
                        // React to the upload (sending the file)
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        // Handle option 1 (Audio File)
                        // Handle option 2 (Document File)
                        await conn.sendMessage(from, {
                            document: { url: downloadUrl},
                            mimetype: "video/mp4",
                            fileName: `${data.title}.mp4`, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
                            caption: info,
                            contextInfo: {
                                mentionedJid: ['94717775628@s.whatsapp.net'], // specify mentioned JID(s) if any
                                groupMentions: [],
                                forwardingScore: 999,
                                isForwarded: true,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: '120363299978149557@newsletter',
                                    newsletterName: "© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚",
                                    serverMessageId: 999
                                },
                                externalAdReply: {
                                    title: '© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚',
                                    body: ' ©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂 💚',
                                    mediaType: 1,
                                    sourceUrl: "https://github.com/Mrrashmika",
                                    thumbnailUrl: 'https://raw.githubusercontent.com/RASH-DATA/ANJU-DATA/refs/heads/main/LOGOS/thisjpg.jpg', // This should match the image URL provided above
                                    renderLargerThumbnail: false,
                                    showAdAttribution: true
                                }
                            }
                          });} 
            
                    // React to the successful completion of the task
                await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
    
                console.log("Response sent successfully");
            });
    
        } catch (e) {
            console.log(e);
            reply(`${e}`);
        }
  }
});

cmd({
    pattern: "yt2s",
    desc: "To download songs.",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, quoted, apikey,baseurl, body, args, q, reply }) => {
    try {
        if (!q) return;
        const Download = q.split(' & ')[0];
        const quality = q.split(' & ')[1];
        const search = await yts(Download);
        const data = search.videos[0];
        const url = data.url;
        // Fetch download URL
        m.react('⬇️')
        const down = await ytmp44(`${url}`,baseurl,`${quality}`,`${apikey}`)                     
        const downloadUrl = down;
        

let info = `
🎥 *MP4 Download Found!* 

➥ *Title:* ${data.title} 
➥ *Duration:* ${data.timestamp} 
➥ *Views:* ${data.views} 
➥ *Uploaded On:* ${data.ago} 
➥ *Link:* ${data.url} 

🎬 *Enjoy the video brought to you by Queen Anju Bot!* 
`
        
            // React to the upload starting (⬆️)
                    m.react('⬆️')
                    await conn.sendMessage(from, {
                        video: { url: downloadUrl}, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
                        caption: info,
                        contextInfo: {
                            mentionedJid: ['923702587522@s.whatsapp.net'], // specify mentioned JID(s) if any
                            groupMentions: [],
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363321103874131@newsletter',
                                newsletterName: "ANSAR-PANHWAR",
                                serverMessageId: 999
                            },
                            externalAdReply: {
                                title: 'ANSAR-PANHWAR',
                                body: 'ANSAR-PANHWAR',
                                mediaType: 1,
                                sourceUrl: "https://github.com/ANSAR-PANHWAR",
                                thumbnailUrl: 'https://qu.ax/VlRBp.jpg', // This should match the image URL provided above
                                renderLargerThumbnail: false,
                                showAdAttribution: true
                            }
                        }
                      });
                    
        
                    // React to the successful completion of the task (✅)
                    m.react('✅')
                }catch(e){
                    console.log(e)
                    reply(`${e}`)
                }
            });

            cmd({
                pattern: "yt3s",
                desc: "To download songs.",
                category: "download",
                filename: __filename
            }, async (conn, mek, m, { from, quoted, apikey,baseurl, body, args, q, reply }) => {
                try {
                    if (!q) return;
                    const Download = q.split(' & ')[0];
                    const quality = q.split(' & ')[1];
                    const search = await yts(Download);
                    const data = search.videos[0];
                    const url = data.url;
                    // Fetch download URL
                    m.react('⬇️')
                    const down = await ytmp44(`${url}`,baseurl,`${quality}`,`${apikey}`)                     
                    const downloadUrl = down;
                    
            
            let info = `
            🎥 *MP4 Download Found!* 
            
            ➥ *Title:* ${data.title} 
            ➥ *Duration:* ${data.timestamp} 
            ➥ *Views:* ${data.views} 
            ➥ *Uploaded On:* ${data.ago} 
            ➥ *Link:* ${data.url} 
            
            🎬 *Enjoy the video brought to you by Queen Anju Bot!* 
            `
                    
                        // React to the upload starting (⬆️)
                                m.react('⬆️')
                                await conn.sendMessage(from, {
                                    document: { url: downloadUrl},
                                    mimetype: "video/mp4",
                                    fileName: `${data.title}.mp4`, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
                                    caption: info,
                                    contextInfo: {
                                        mentionedJid: ['923702587522@s.whatsapp.net'], // specify mentioned JID(s) if any
                                        groupMentions: [],
                                        forwardingScore: 999,
                                        isForwarded: true,
                                        forwardedNewsletterMessageInfo: {
                                            newsletterJid: '120363321103874131@newsletter',
                                            newsletterName: "© 𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝗑ᴾᴿᴼ 💚",
                                            serverMessageId: 999
                                        },
                                        externalAdReply: {
                                            title: 'ANSAR-PANHWAR',
                                            body: 'ANSAR-PANHWAR',
                                            mediaType: 1,
                                            sourceUrl: "https://github.com/ANSAR-PANHWAR",
                                            thumbnailUrl: 'https://qu.ax/VlRBp.jpg', // This should match the image URL provided above
                                            renderLargerThumbnail: false,
                                            showAdAttribution: true
                                        }
                                    }
                                  });
                                
                    
                                // React to the successful completion of the task (✅)
                                m.react('✅')
                            }catch(e){
                                console.log(e)
                                reply(`${e}`)
                            }
                        });

