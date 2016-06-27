class Api::PlatesController < Api::BaseController
  def index
    page = Plate.structured_for_api
    render json: page
  end
end