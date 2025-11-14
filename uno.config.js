import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  exclude: ['node_modules', '.git', '.vscode', 'dist', 'public'],
  presets: [
    presetAttributify(),
    presetUno(),
    presetIcons()
  ],
  rules: [
    ['bg-size-100%', { 'background-size': '100% 100%' }],
    [/bg-size-(\d+)-(\d+)$/, match => ({ 'background-size': `${match[1]}px ${match[2]}px` })],
    [/ls-(\d+)$/, match => ({ 'letter-spacing': `${match[1]}px` })],
  ],
  shortcuts: {
    'wh-full': 'w-full h-full',
    'flex-center': 'flex justify-center items-center',
    'flex-between': 'flex justify-between items-center',
    'flex-col-center': 'flex-center flex-col',
    'flex-x-center': 'flex justify-center',
    'flex-y-center': 'flex items-center',
    'flex-col': 'flex flex-col',
    'flex-end': 'flex justify-end items-center',
    'absolute-lt': 'absolute left-0 top-0',
    'absolute-lb': 'absolute left-0 bottom-0',
    'absolute-rt': 'absolute right-0 top-0',
    'absolute-rb': 'absolute right-0 bottom-0',
    'absolute-tl': 'absolute-lt',
    'absolute-tr': 'absolute-rt',
    'absolute-bl': 'absolute-lb',
    'absolute-br': 'absolute-rb',
    'absolute-center': 'absolute-lt flex-center wh-full',
    'nowrap-hidden': 'whitespace-nowrap overflow-hidden',
    'ellipsis-text': 'nowrap-hidden text-ellipsis',
    'transition-base': 'transition-all duration-300 ease-in-out',
    'page-a4': 'relative m-x-auto w-706px h-1000px bg-white mb-15px b-1 p-x-100px p-y-80px b-#ccc shadow-[0_0_10px_#ddd]',
    'page-a4-h': 'relative m-x-auto w-1000px h-706px bg-white mb-15px b-1 p-x-80px p-y-100px b-#ccc shadow-[0_0_10px_#ddd]',
    'page-number': 'absolute bottom-40px left-50% text-#555 transform-translate-x--50% text-12px font-400',
    'aside-box': 'w-340px h-100% bg-white relative transition-base b-1 b-solid b-#e5e5e5 flex-col p-15px',
    'isPanelClose': 'transform-translate-x--100%',
    'toggle-btn': 'w-0px h-64px absolute top-46% right--14px border-r-1 border-l-12 border-t-9  border-b-9 border-transparent border-l-#e5e5e5 cursor-pointer',
    'flex-xCenter-mb': 'flex-x-center mb-5px'
  },
})
