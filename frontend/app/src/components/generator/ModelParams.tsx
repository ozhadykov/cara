import React, { useState } from "react"
import { Range, TabCard } from "../index.tsx"
import { IModelParams } from "../../pages/PairGenerator.tsx"

interface IModelParamsProps {
    next: () => void
    prev: () => void
    setWeightsForModel: (weightsForModel: IModelParams) => void
}

const ModelParams = ({ next, prev, setWeightsForModel }: IModelParamsProps) => {

    const [travelTimeImportance, setTravelTimeImportance] = useState<string>("1")
    const [overtimePenalty, setOvertimePenalty] = useState<string>("2")
    const [undertimePenalty, setUndertimePenalty] = useState<string>("4")
    const [splitThreshold, setSplitThreshold] = useState<string>("27")

    const handleNextStep = () => {
        const params: IModelParams = {
            travelTimeImportance: parseInt(travelTimeImportance),
            overtimePenalty: parseInt(overtimePenalty),
            undertimePenalty: parseInt(undertimePenalty),
            splitThreshold: parseInt(splitThreshold),
        }

        setWeightsForModel(params)

        next()
    }

    return (
        <div className="step-3-model-params-setup overflow-y-hidden">
            <TabCard title="Step 3: Model parameters setup">
                <div className="params-wrapper flex flex-col gap-6">
                    <div className="param-card">
                        <Range label={"Travel time importance"}
                               description={"Define how important should travel time be interpreted in model"}
                               setValueForParent={setTravelTimeImportance}
                               initialValue={travelTimeImportance}
                               min={0}
                               max={10}
                               step={1}
                        />
                    </div>
                    <div className="param-card">
                        <Range label={"Overtime penalty rate"}
                               description={"Define how strong will be overtime hours penalized in model"}
                               setValueForParent={setOvertimePenalty}
                               initialValue={overtimePenalty}
                               min={0}
                               max={10}
                               step={1}
                        />
                    </div>
                    <div className="param-card">
                        <Range label={"Undertime importance"}
                               description={"Define how strong will be undertime hours penalized in model"}
                               setValueForParent={setUndertimePenalty}
                               initialValue={undertimePenalty}
                               min={0}
                               max={10}
                               step={1}
                        />
                    </div>
                    <div className="param-card">
                        <Range label={"Split threshold"}
                               description={"Define the number of requested hours from which the model should attempt to assign two assistants to a child."}
                               setValueForParent={setSplitThreshold}
                               initialValue={splitThreshold}
                               min={0}
                               max={40}
                               step={1}
                        />
                    </div>
                </div>
                <div className="generator-controls flex items-center justify-between gap-3 mt-6">
                    <button className="btn btn-soft btn-wide" onClick={prev}>previous step</button>
                    <button className="btn btn-soft btn-wide btn-secondary" onClick={handleNextStep}>next step</button>
                </div>
            </TabCard>
        </div>
    )
}

export default ModelParams