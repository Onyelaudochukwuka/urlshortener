import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
const Url = require('../../models/Url');
const validUrl = require('valid-url');
const shortid = require('shortid');
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { slug } = req.query;
  await dbConnect()

  switch (method) {
    case 'GET':
  try {
    const url = await Url.findOne({ urlCode: slug });
    if (url) {
      let update = await Url.updateOne({ urlCode: slug }, { $inc: { linkClicks: 1 } });
        return res.redirect(308, url.longUrl);
      } else {
          return res.status(404).json('No url found');
      }
  } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
  }  
      break
     
    default:
      res.status(500).json('Server error');
      break
  }
}
