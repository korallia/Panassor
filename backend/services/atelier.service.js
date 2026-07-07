import pool from "../db/pool.js";

export async function fetchPublishedAtelierVideos() {
  const result = await pool.query(`
    SELECT
      id,
      slug_fr,
      slug_en,
      title_fr,
      title_en,
      eyebrow_fr,
      eyebrow_en,
      description_fr,
      description_en,
      video_url,
      poster_url,
      sort_order,
      featured,
      status
    FROM atelier_videos
    WHERE status = 'published'
      AND NULLIF(TRIM(video_url), '') IS NOT NULL
    ORDER BY featured DESC, sort_order ASC, created_at DESC;
  `);

  return result.rows;
}