import resolve from '@rollup/plugin-node-resolve'; // Плагин для разрешения зависимостей из node_modules
import commonjs from '@rollup/plugin-commonjs'; // Плагин для работы с commonjs модулями
import babel from '@rollup/plugin-babel'; // Плагин для компиляции с Babel

export default {
  input: 'src/index.js', // Точка входа в проект
  output: {
    file: 'dist/bundle.js', // Выходной файл
    format: 'esm', // Формат вывода (ESM)
  },
  plugins: [
    resolve(), // Обрабатывает модули из node_modules
    commonjs(), // Преобразует CommonJS в ESM
    babel({ babelHelpers: 'bundled' }) // Для использования с Babel (если нужно)
  ]
};
