class Api::PlatesController < Api::BaseController
  def index
    page = Plate.structured_for_api
    render json: page
  end

  def show
    # Some useful suggestions:
    # hoe|h0e|h03
    # pen|p3n|peck
    # BAD
    # w3t|wet
    # ass|a55|as5|asho|ash0|a5ho|a5h0|a22|myas
    # nuts|nutz
    # 69
    # dtf
    # pusy|pus|vag|pss
    # ADD: a place to search for a phrase and show matching plates
      # Make line graph charting all occurences over time, dynamic/searchable

    page = Plate.matching_plate_text(params[:id])
    render json: page
  end

  def plates_by_month
    page = Plate.all.group_by_month
    render json: page
  end
end