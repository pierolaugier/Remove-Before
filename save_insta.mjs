// netlify/functions/save_insta/save_insta.mjs
import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { insta } = JSON.parse(event.body || "{}");

    if (!insta || typeof insta !== "string" || insta.trim() === "") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid Instagram name" }),
      };
    }

    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`
      INSERT INTO client (insta)
      VALUES (${insta})
      RETURNING id, insta;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        client: result[0],
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
