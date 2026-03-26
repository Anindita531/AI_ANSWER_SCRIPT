# Use Node 20 (VERY IMPORTANT for pdfjs + dependencies)
FROM node:20

# Install all required system dependencies (canvas + pdf-poppler)
RUN apt-get update && apt-get install -y \
    poppler-utils \
    poppler-data \
    libpoppler-cpp-dev \
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    librsvg2-dev \
    build-essential \
    python3

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy full project
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
