class Plate < ActiveRecord::Base
  class << self
    def group_by_month
      all.sort_by(&:date_by_month).group_by(&:date_by_month)
    end

    def plates_content
      all.collect { |plate| plate.proposed_content }
    end

    def structured_for_api
      plates = all.sort_by(&:date_by_month).group_by(&:date_by_month)
      restructured_plates = []
      plates.each do | month_key, all_plates_value |
        new_month = {}
        new_month[:month] = Date::MONTHNAMES[month_key.to_i]
        new_month[:count] = all_plates_value.count
        new_month[:plates_content] = all_plates_value
        restructured_plates << new_month
      end
      restructured_plates
    end
  end

  def date_by_month
    self.date.strftime("%m")
  end

  def date_by_day
    date.strftime("%d")
  end
end
