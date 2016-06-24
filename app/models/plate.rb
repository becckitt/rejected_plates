class Plate < ActiveRecord::Base
  attr_reader :date, :proposed_content
  
  def initialize(date, proposed_content)
    @date = date.to_datetime
    @proposed_content = proposed_content
  end
end
