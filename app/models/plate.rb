class Plate < ActiveRecord::Base
  class << self
    def group_by_date
      all.group_by{ |plate| plate.date.strftime("%B") }
    end

    def plates_content
      all.collect { |plate| plate.proposed_content }
    end
  end

  def date_by_day
    date.strftime("%d")
  end
end
