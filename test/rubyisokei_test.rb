require_relative '../rubyistokei'

require 'test/unit'
require 'rack/test'
require 'json'

set :environment, :test

class RubyistokeiTest < Test::Unit::TestCase
  include Rack::Test::Methods

  def app
    Rubyistokei::Application
  end

  def test_root
    get '/'
    assert last_response.ok?
  end

  def test_data_json
    get '/data.json'
    assert last_response.ok?
    assert JSON.parse(last_response.body).is_a?(Array)
  end

  def test_css
    get '/css/screen.css'
    assert last_response.ok?
  end
end
