class Plate < ActiveRecord::Base
  class << self
    def group_by_month
      all.sort_by(&:date_by_month).group_by(&:date_by_month)
    end

    def group_by_year
      all.sort_by(&:date_by_year).group_by(&:date_by_year)
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

    def matching_plate_text(regex_pattern)
      regex_pattern = regex_pattern.upcase
      all.select { | plate | plate.proposed_content.match(regex_pattern) }
    end

    def character_frequency
      sorted_characters.chunk{|char| char.ord }.collect{|char, count| { character: char.chr, count: count.length} }
    end

    def sorted_characters
      all_proposed_content.collect{|text| text.split("")}.flatten.sort
    end

    def all_proposed_content
      all.pluck(:proposed_content)
    end

    def sorted_characters_by_combination
      character_combinations = []
      all_proposed_content.each do |text|
        text = text.size.even? ? text : text[0..(text.size-1)]
        characters = text.split("")
        while characters.size > 0
          character_combinations << characters.slice!(0,2)
        end
      end
      character_combinations
    end
  end

  def date_by_year
    date.strftime("%Y")
  end

  def date_by_month
    date.strftime("%m")
  end

  def date_by_day
    date.strftime("%d")
  end
end
