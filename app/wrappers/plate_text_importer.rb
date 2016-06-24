class PlateTextImporter
  def collect_plates(plates_file)
    file_contents = File.read(plates_file).split(/\s+/)
    file_contents.each do |plate|
      plate = plate.split(",")
      plate_date = plate[0]
      plate_contents = plate[1]
      Plate.new(plate_date, plate_contents)
    end
  end
end