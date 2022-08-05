import { Image, BlitzPage, Link } from "blitz"
import Layout from "app/core/layouts/Layout"

const features = [
  {
    name: "Book a venue",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageSrc: "https://tailwindui.com/img/ecommerce-images/product-feature-07-detail-01.jpg",
    imageAlt:
      "White canvas laptop sleeve with gray felt interior, silver zipper, and tan leather zipper pull.",
    buttonLink: "/venues",
  },
  {
    name: "Add your venue to our database",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageSrc: "https://tailwindui.com/img/ecommerce-images/product-feature-07-detail-02.jpg",
    imageAlt: "Detail of zipper pull with tan leather and silver rivet.",
    buttonLink: "/venues/new",
  },
]

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

const Home: BlitzPage = () => {
  return (
    <div>
      <div className="max-w-2xl mx-auto py-24 px-4 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
        <div className="space-y-16">
          {features.map((feature, featureIdx) => (
            <div
              key={feature.name}
              className="flex flex-col-reverse lg:grid lg:grid-cols-12 lg:gap-x-8 lg:items-center"
            >
              <Link href={feature.buttonLink}>
                <div
                  className={classNames(
                    featureIdx % 2 === 0 ? "lg:col-start-1" : "lg:col-start-8 xl:col-start-9",
                    "mt-6 lg:mt-0 lg:row-start-1 lg:col-span-5 xl:col-span-4"
                  )}
                >
                  <h3 className="text-lg font-medium text-slate-10">{feature.name}</h3>
                  <p className="mt-2 text-base text-slate-12">{feature.description}</p>
                </div>
              </Link>
              <div
                className={classNames(
                  featureIdx % 2 === 0 ? "lg:col-start-6 xl:col-start-5" : "lg:col-start-1",
                  "flex-auto lg:row-start-1 lg:col-span-7 xl:col-span-8"
                )}
              >
                <div className="aspect-w-5 aspect-h-2 rounded-lg bg-slate-03 overflow-hidden">
                  <Image
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    height={256}
                    width={640}
                    className="object-center object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
