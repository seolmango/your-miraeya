import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      // 카톡/인스타 등 인앱 브라우저는 InAppBrowserNotice가 외부 브라우저로 유도하므로,
      // 여기서는 "그 안내 UI 자체가 뜰 수 있을 만큼의" 구형 WebView만 지원하면 된다.
      // 2018년 이전 기기는 사실상 트래픽이 없어 폴리필 비용 대비 실익이 낮다.
      targets: ['iOS >= 13', 'Android >= 8', 'Chrome >= 70'],
    }),
  ],
  base: process.env.GITHUB_PAGES ? '/your-miraeya/' : '/',
})
