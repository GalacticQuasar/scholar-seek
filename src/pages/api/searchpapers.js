export default async function handler(req, res) {
    const query = req.body.downloadUrl;
    console.log("Download URL:", query);
   
    res.status(200).json(" ")
}