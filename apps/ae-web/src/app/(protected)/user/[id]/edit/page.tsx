// sections
import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

type Props = {
    params: {
        id: number;
    };
};

export default function UserEditPage({ params }: Props) {
    const { id } = params;

    return <UserEditView id={id} />;
}

