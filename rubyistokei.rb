require 'bundler'
Bundler.require

module Rubyistokei
  class Application < Sinatra::Application
    get '/' do
      'Rubyistokei'
    end
  end
end
