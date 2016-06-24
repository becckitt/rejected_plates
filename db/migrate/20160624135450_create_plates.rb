class CreatePlates < ActiveRecord::Migration
  def change
    create_table :plates do |t|
      t.datetime    :date
      t.string      :proposed_content
      t.timestamps  null: false
    end
  end
end
