import forms from "@tailwindcss/forms";
import type {Config} from 'tailwindcss'

export default <Partial<Config>>{
  plugins: [
    forms,
  ],
}