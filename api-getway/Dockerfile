# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
# بنحتاج كل الـ deps عشان نعرف نعمل Build
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app

# تعيين البيئة لـ production
ENV NODE_ENV=production

# نسخ الملفات الضرورية فقط من المرحلة الأولى
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# تثبيت الـ Production dependencies فقط (بيوفر مساحة ضخمة)
RUN npm install --only=production

# تغيير المستخدم لزيادة الأمان
USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]