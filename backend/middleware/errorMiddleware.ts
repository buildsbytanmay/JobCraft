import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('API Error:', err?.message || err);

  const rawMessage = err?.message || String(err);
  let userFriendlyMessage = rawMessage;

  // Handle temporary Gemini API demand / 503 / 429
  if (
    rawMessage.includes('503') ||
    rawMessage.includes('high demand') ||
    rawMessage.includes('UNAVAILABLE')
  ) {
    userFriendlyMessage =
      'The AI service is currently experiencing temporary high demand. Please try again in a few moments.';
  } else if (rawMessage.includes('429') || rawMessage.includes('RESOURCE_EXHAUSTED')) {
    userFriendlyMessage =
      'AI request rate limit reached. Please wait a moment before generating again.';
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: userFriendlyMessage,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
