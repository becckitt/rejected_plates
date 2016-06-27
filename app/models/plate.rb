class Plate < ActiveRecord::Base
  class << self
    def group_by_date
      grouped_plates = all.group_by{ |plate| plate.date.strftime("%B") }
    end
  end

  def date_by_day
    date.strftime("%d")
  end
end
