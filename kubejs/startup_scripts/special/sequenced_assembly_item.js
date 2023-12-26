StartupEvents.registry('item', event => {
    event.create('kubejs:incomplete_lung_template', 'create:sequenced_assembly').texture('kubejs:item/organs/template/lung_template')
    event.create('kubejs:incomplete_muscle_template', 'create:sequenced_assembly').texture('kubejs:item/organs/template/muscle_template')
    event.create('kubejs:incomplete_heart_template', 'create:sequenced_assembly').texture('kubejs:item/organs/template/lung_template')
    event.create('kubejs:incomplete_intestine_template', 'create:sequenced_assembly').texture('kubejs:item/organs/template/intestine_template')
    event.create('kubejs:incomplete_rib_template', 'create:sequenced_assembly').texture('kubejs:item/organs/template/rib_template')
    event.create('kubejs:incomplete_spine_template', 'create:sequenced_assembly').texture('kubejs:item/organs/template/spine_template')
    event.create('kubejs:incomplete_spleen_template', 'create:sequenced_assembly').texture('kubejs:item/organs/template/spleen_template')
    event.create('kubejs:incomplete_stomach_template', 'create:sequenced_assembly').texture('kubejs:item/organs/template/stomach_template')
    event.create('kubejs:incomplete_kidney_template', 'create:sequenced_assembly').texture('kubejs:item/organs/template/kidney_template')
    event.create('kubejs:incomplete_liver_template', 'create:sequenced_assembly').texture('kubejs:item/organs/template/liver_template')
    event.create('kubejs:incomplete_appendix_template', 'create:sequenced_assembly').texture('kubejs:item/organs/template/appendix_template')

    event.create('kubejs:incomplete_burning_heart', 'create:sequenced_assembly').texture('kubejs:item/organs/machine/burning_heart')
    event.create('kubejs:incomplete_furnace_core', 'create:sequenced_assembly').texture('kubejs:item/organs/machine/furnace_core')
    event.create('kubejs:incomplete_revolution_relay', 'create:sequenced_assembly').texture('kubejs:item/organs/machine/revolution_relay')
    event.create('kubejs:incomplete_revolution_delay', 'create:sequenced_assembly').texture('kubejs:item/organs/machine/revolution_delay')
})