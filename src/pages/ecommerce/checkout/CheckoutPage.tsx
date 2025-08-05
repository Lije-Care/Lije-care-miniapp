const CheckoutPage = () => {
  return (
    <div>
      <section className="bg-gray-200 py-8 antialiased dark:bg-gray-800 md:py-16">
        <form action="#" className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-600 dark:text-gray-300 sm:text-base">
            <li className="after:border-1 flex items-center text-primary-600 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-300 dark:text-primary-400 dark:after:border-gray-600 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
              <span className="flex items-center after:mx-2 after:text-gray-300 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                <svg
                  className="me-2 h-4 w-4 sm:h-5 sm:w-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Cart
              </span>
            </li>
            <li className="after:border-1 flex items-center text-primary-600 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-300 dark:text-primary-400 dark:after:border-gray-600 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
              <span className="flex items-center after:mx-2 after:text-gray-300 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                <svg
                  className="me-2 h-4 w-4 sm:h-5 sm:w-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Checkout
              </span>
            </li>
            <li className="flex shrink-0 items-center">
              <svg
                className="me-2 h-4 w-4 sm:h-5 sm:w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Order summary
            </li>
          </ol>
          <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
            <div className="min-w-0 flex-1 space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Delivery Details
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="your_name"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {" "}
                      Your name{" "}
                    </label>
                    <input
                      type="text"
                      id="your_name"
                      className="block w-full rounded-lg border border-black bg-white p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-black dark:bg-white dark:text-gray-900 dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      placeholder="Bonnie Green"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="your_email"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {" "}
                      Your email*{" "}
                    </label>
                    <input
                      type="email"
                      id="your_email"
                      className="block w-full rounded-lg border border-black bg-white p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-black dark:bg-white dark:text-gray-900 dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      placeholder="test@lijecare.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="your_phone"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {" "}
                      Your Phone{" "}
                    </label>
                    <input
                      type="text"
                      id="your_phone"
                      className="block w-full rounded-lg border border-black bg-white p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-black dark:bg-white dark:text-gray-900 dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      placeholder="+251961197371"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {" "}
                      City{" "}
                    </label>
                    <input
                      type="city"
                      id="city"
                      className="block w-full rounded-lg border border-black bg-white p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-black dark:bg-white dark:text-gray-900 dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      placeholder="Addis ababa"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Payment
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-gray-300 bg-white p-4 ps-4 dark:border-gray-600 dark:bg-white">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="credit-card"
                          aria-describedby="credit-card-text"
                          type="radio"
                          name="payment-method"
                          value=""
                          className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-white dark:ring-offset-gray-200 dark:focus:ring-primary-600"
                          checked
                        />
                      </div>
                      <div className="ms-4 text-sm">
                        <label
                          htmlFor="credit-card"
                          className="font-medium leading-none text-gray-900 dark:text-gray-900"
                        >
                          {" "}
                          Chapa{" "}
                        </label>
                        <p
                          id="credit-card-text"
                          className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-500"
                        >
                          Pay with your chapa account
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-300 bg-white p-4 ps-4 dark:border-gray-600 dark:bg-white">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="pay-on-delivery"
                          aria-describedby="pay-on-delivery-text"
                          type="radio"
                          name="payment-method"
                          value=""
                          className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-white dark:ring-offset-gray-200 dark:focus:ring-primary-600"
                        />
                      </div>
                      <div className="ms-4 text-sm">
                        <label
                          htmlFor="pay-on-delivery"
                          className="font-medium leading-none text-gray-900 dark:text-gray-900"
                        >
                          {" "}
                          Payment on delivery{" "}
                        </label>
                        <p
                          id="pay-on-delivery-text"
                          className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-500"
                        >
                          +ETB 5 payment processing fee
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Delivery Methods
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-gray-300 bg-white p-4 ps-4 dark:border-gray-600 dark:bg-white">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="dhl"
                          aria-describedby="dhl-text"
                          type="radio"
                          name="delivery-method"
                          value=""
                          className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-white dark:ring-offset-gray-200 dark:focus:ring-primary-600"
                          checked
                        />
                      </div>
                      <div className="ms-4 text-sm">
                        <label
                          htmlFor="dhl"
                          className="font-medium leading-none text-gray-900 dark:text-gray-900"
                        >
                          {" "}
                          ETB 50 - DHL Fast Delivery{" "}
                        </label>
                        <p
                          id="dhl-text"
                          className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-500"
                        >
                          Get it by Tomorrow
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-300 bg-white p-4 ps-4 dark:border-gray-600 dark:bg-white">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="fedex"
                          aria-describedby="fedex-text"
                          type="radio"
                          name="delivery-method"
                          value=""
                          className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-white dark:ring-offset-gray-200 dark:focus:ring-primary-600"
                        />
                      </div>
                      <div className="ms-4 text-sm">
                        <label
                          htmlFor="fedex"
                          className="font-medium leading-none text-gray-900 dark:text-gray-900"
                        >
                          {" "}
                          Free Delivery
                        </label>
                        <p
                          id="fedex-text"
                          className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-500"
                        >
                          Get it by Friday, 13 Dec 2023
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div>
                <label
                  htmlFor="voucher"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  {" "}
                  Enter a gift card, voucher or promotional code{" "}
                </label>
                <div className="flex max-w-md items-center gap-4">
                  <input
                    type="text"
                    id="voucher"
                    className="block w-full rounded-lg border border-black bg-white p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-black dark:bg-white dark:text-gray-900 dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder=""
                    required
                  />
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Apply
                  </button>
                </div>
              </div> */}
            </div>
            <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
              <div className="flow-root">
                <div className="-my-3 divide-y divide-gray-300 dark:divide-gray-600">
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-600 dark:text-gray-400">
                      Subtotal
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      ETB 8,094.00
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-600 dark:text-gray-400">
                      Tax
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      ETB 199
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-bold text-gray-900 dark:text-white">
                      Total
                    </dt>
                    <dd className="text-base font-bold text-gray-900 dark:text-white">
                      ETB 8,392.00
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CheckoutPage;
