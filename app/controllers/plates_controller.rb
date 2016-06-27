class PlatesController < ApplicationController
  def index
    @plates = Plate.all
  end
end
