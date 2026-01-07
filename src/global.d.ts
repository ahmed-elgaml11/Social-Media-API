export interface IUserPaylod {
    id: string,
    name: string,
    email: string,
    role: IRole,
    isActive: boolean
}

declare type IRole = 'admin' | 'user'

declare type IPrivacy = 'private' | 'public' | 'friends'

declare type IReactionType = 'like' | 'love' | 'haha' | 'wow' | 'happy' | 'angry'

declare type IFriendRequestType = 'accept' | 'reject' | 'pending'

declare type INotificationType = 'friend_request' | 'comment' | 'like'

declare global {
  namespace Express {
    interface Request {
        user?: IUserPaylod
    }
  }
}





// // /shared/excel.service.js
// const XLSX = require("xlsx");

// class ExcelService {
//   parseExcel(fileBuffer) {
//     const workbook = XLSX.read(fileBuffer, { type: "buffer" });
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     return XLSX.utils.sheet_to_json(sheet);
//   }
// }

// module.exports = new ExcelService();





// // /modules/cities/city.mapper.js
// module.exports = function mapCity(row) {
//   return {
//     name: row["City Name"],
//     countryName: row["Country"],  // هنستخدم دا للـ lookup
//     population: row["Population"] || null
//   };
// };



// // /modules/cities/city.mapper.js
// module.exports = function mapCity(row) {
//   return {
//     name: row["City Name"],
//     countryName: row["Country"],  // هنستخدم دا للـ lookup
//     population: row["Population"] || null
//   };
// };





// // /modules/cities/city.service.js

// const City = require("./city.model");
// const Country = require("../countries/country.model");
// const excelService = require("../../shared/excel.service");
// const mapCity = require("./city.mapper");

// class CityService {

//   async importCities(fileBuffer) {
//     const rows = excelService.parseExcel(fileBuffer);

//     // 1️⃣ mapping
//     const mappedRows = rows.map(mapCity);

//     const finalData = [];

//     for (const row of mappedRows) {
//       // 2️⃣ validation
//       if (!row.name || !row.countryName) {
//         console.log("Skipping row: missing data");
//         continue;
//       }

//       // 3️⃣ Lookup Country Name → Country ID
//       const country = await Country.findOne({ name: row.countryName });

//       if (!country) {
//         console.log(`Country not found for row: ${row.name}`);
//         continue; // ممكن تخزن errors وترجعها في الرد
//       }

//       // 4️⃣ build final object
//       finalData.push({
//         name: row.name,
//         population: row.population,
//         country: country._id,  // ID inserted here
//       });
//     }

//     // 5️⃣ bulk insert
//     await City.insertMany(finalData, { ordered: false });

//     return {
//       totalRows: rows.length,
//       inserted: finalData.length
//     };
//   }
// }

// module.exports = new CityService();





// const express = require("express");
// const multer = require("multer");
// const upload = multer();
// const cityService = require("./city.service");
// const router = express.Router();

// router.post("/import", upload.single("file"), async (req, res) => {
//   try {
//     const result = await cityService.importCities(req.file.buffer);
//     res.json(result);
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ message: err.message });
//   }
// });

// module.exports = router;




// const fs = require("fs");

// const stream = fs.createReadStream("large-file.txt");

// stream.on("data", (chunk) => {
//   console.log("Received chunk:", chunk.length);
// });

// stream.on("end", () => {
//   console.log("File finished");
// });


// dyacnos81
// 167585583857694
// PBOIWgs_Rfq9NTjna2QQ2G9w3Xk