import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import formidable, { Fields, File } from "formidable";

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "/public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export const POST = async (req: NextRequest) => {
  const form = formidable({ uploadDir, keepExtensions: true });

  return new Promise<NextResponse>((resolve, reject) => {
    form.parse(
      req as any,
      (err: any, fields: Fields, files: formidable.Files) => {
        if (err) return reject(err);

        // Handle the uploaded file
        const file = files.image as unknown as File;
        const filename = path.basename(file.filepath);

        // Return the uploaded file info + other fields
        resolve(
          NextResponse.json({
            ...fields,
            image: `/uploads/${filename}`,
          })
        );
      }
    );
  });
};
