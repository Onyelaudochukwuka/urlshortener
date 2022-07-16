import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
const Url = require('../../models/Url');
const validUrl = require('valid-url');
const shortid = require('shortid');
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { longUrl, customExt, email } = req.body;
  const baseUrl = process.env.BASE_URL;
  await dbConnect()

  switch (method) {
    case 'POST':
        if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('invalid base url');
    }
      const Code = shortid.generate();
      const urlCode = customExt ? customExt : Code;
      if (validUrl.isUri(longUrl)) {
        try {
          let exists = await Url.findOne({ urlCode });
          if (!exists) {
            let url = await Url.findOne({ longUrl, userEmail: email });
            if (url) {
              res.status(200).json(url);
            } else {
              const shortUrl = baseUrl + urlCode;
              url = new Url({
                userEmail: email,
                longUrl,
                shortUrl,
                urlCode,
                date: new Date()
              });
              await url.save();

              res.status(200).json(url);
            }
          } else {
            res.status(402).json({ success: false})
          }
        } catch (err) {
          console.error(err);
          res.status(500).json('Server error');
        }
      }
         else {
        res.status(401).json('Invalid long url');
    }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}