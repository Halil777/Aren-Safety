import { Hero3D } from '../sections/Hero3D'
import { Features } from '../sections/Features'
import { Industries } from '../sections/Industries'
import { Stats } from '../sections/Stats'
import { Testimonials } from '../sections/Testimonials'
import { Partners } from '../sections/Partners'
import { Pricing } from '../sections/Pricing'
import { CTA } from '../sections/CTA'

export default function Home() {
  return (
    <>
      <Hero3D />
      <Features />
      <Industries />
      <Stats />
      <Testimonials />
      <Partners />
      <Pricing />
      <CTA />
    </>
  )
}
