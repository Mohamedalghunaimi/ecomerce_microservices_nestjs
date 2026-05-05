# المرحلة الأولى: البناء
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/ 

RUN npm install

COPY . .

# توليد ملفات بريزما (Client)
RUN npx prisma generate

RUN npm run build

# المرحلة الثانية: التشغيل (صورة خفيفة جداً)
FROM node:18-alpine

WORKDIR /app

# نسخ الملفات الضرورية فقط من مرحلة البناء
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# تثبيت مستخدم غير جذر للأمان
USER node

EXPOSE 3002

# استخدام shell لتنفيذ الميغريشن ثم تشغيل التطبيق
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]