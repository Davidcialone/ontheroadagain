// export async encode(){
//     const { data } = req.body;
//   if (!data) {
//     return res.status(400).send('Data is required');
//   }
//   const encodedData = Buffer.from(data).toString('base64');
//   res.json({ encoded: encodedData });
// }

// export async decode(){
// const { data } = req.body;

//   if (!data) {
//     return res.status(400).send('Data is required');
//   }

//   const decodedData = Buffer.from(data, 'base64').toString('utf-8');
//   res.json({ decoded: decodedData });}