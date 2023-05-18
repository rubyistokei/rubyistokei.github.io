# Rubyistokei

Introduce your Ruby friends with the clock!

## What is this?

Rubyistokei is a web application to show a clock of Rubyists, by Rubyists, for Rubyists. You can introduce your Ruby friends to the world with the clock. "Tokei" (時計) means "clock" in Japanese.

Rubyistokei shows Rubyists every minute. We want to help Rubyists to know Rubyists each other by sight. So, we kindly ask you to add your Ruby friends to this project. Instruction follows.

## How to add Ruby friends?

1. Obtain permissions from both of the Rubyist and the photographer (if you are not of them).
2. Create metadata for the Rubyist under [data directory](https://github.com/rubyistokei/rubyistokei.github.io/tree/main/data).
3. Send pull request.

## Any problem?

Please open [an issue](https://github.com/rubyistokei/rubyistokei.github.io/issues).

## History

Rubyistokei was originally built to be exhibited at [RubyKaigi 2013](http://rubykaigi.org/2013 "RubyKaigi 2013, May 30 - Jun 1") in the venue.


## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) with your browser.

See [Next.js documentation](https://nextjs.org/docs/) for more details.

## ProTip!

* If you want to pin a specific photo, use `pin` query parameter. For `data/matz.yaml`, use `http://localhost:3000/?pin=matz`. Useful for creating data.
* In development mode, the photos switches 10x faster for debugging purposes. This behavior can be controlled with the environment variable `NEXT_PUBLIC_SPEED`. The setting for development mode is located in `.env.development`.
