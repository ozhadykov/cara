import { Icon } from "@iconify/react/dist/iconify.js"
import { Child } from "../../lib/models"

type ChildBoxProps = {
    child: Child
}

const ChildBox = ({ child }: ChildBoxProps) => {
    return (
        <div className="flex-1 flex flex-col p-5">
            <div className="rounded-2xl border-2 h-full border-blue-200 p-5 gap-5 flex flex-col">
                <div className="flex gap-5 items-center">
                    <div className={`p-2 rounded-full bg-blue-100`}>
                        <Icon
                            icon="solar:people-nearby-line-duotone"
                            className="text-3xl text-blue-600"
                        />
                    </div>

                    <div className="flex flex-col">
                        <span className="font-semibold text-lg">
                            {child.first_name} {child.family_name}
                        </span>
                        <div className="badge bg-blue-100 badge-md text-blue-600">Child</div>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Icon icon="solar:book-outline" className="text-xl" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            REQUIRED QUALIFICATION
                        </p>
                        <p className="text-sm text-gray-700">{child.required_qualification_text}</p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Icon icon="solar:clock-circle-outline" className="text-xl" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            REQUESTED HOURS
                        </p>
                        <p className="text-sm text-gray-700">{child.requested_hours}h</p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Icon icon="solar:map-point-linear" className="text-xl" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Facility</p>
                        <p className="text-sm text-gray-700">
                            {child.street} {child.street_number}
                        </p>
                        <p className="text-sm text-gray-700">
                            {child.zip_code} {child.city}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChildBox
