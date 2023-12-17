import Head from 'next/head'

import { content } from './content'

const TermsOfServicePage = () => {
  return (
    <div>
      <Head>
        <title>UME | Điều khoản sử dụng</title>
      </Head>
      <div className="mx-20 ">
        <h1 className="text-4xl font-bold text-white">Điều khoản sử dụng</h1>
      </div>
      <div className="flex flex-col mx-16 ">
        {content.map((item) => (
          <div key={item.id} className="w-full h-full mt-6">
            <h1 className="text-2xl font-bold text-white">{item.question}</h1>
            {Object.keys(item.answers).map((key, index) => (
              <p key={index} className="mt-4 text-justify text-white">
                {item.answers[key]}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TermsOfServicePage
