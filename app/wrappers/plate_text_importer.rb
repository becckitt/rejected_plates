class PlateTextImporter
  def collect_plates(plates_file)
    file_contents = File.read(plates_file).split(/\s+/)
    file_contents.each do |plate|
      plate = plate.split(",")
      plate_date = plate[0]
      plate_contents = plate[1]
      Plate.find_or_create_by(date: plate_date, proposed_content: plate_contents)
    end
  end
end